import { User, Deck, Lesson, Vocabulary, UserLesson, ReviewSession } from '../models/index.js';
import { generateLessonQuiz } from '../services/quizService.js';

// 1. Implement GET /api/lessons (UPDATED for HSK Filtering and unlock logic)
export const getAllLessons = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch the logged-in user to see what HSK level they selected
        const user = await User.findByPk(userId);

        const hskLevelFilter = req.query.hsk_level ? { hsk_level: req.query.hsk_level } : {};

        // Fetch lessons that belong to Decks, optionally filtering by HSK level
        const lessons = await Lesson.findAll({
            include: [{
                model: Deck,
                where: hskLevelFilter,
                required: true,  // INNER JOIN on Deck (we need the deck info)
                attributes: ['title', 'hsk_level']
            }, {
                model: Vocabulary,
                attributes: ['id'], // Just need IDs to count words
                required: false     // LEFT JOIN — include lessons even if they have no vocabulary yet
            }],
            order: [
                [Deck, 'hsk_level', 'ASC'],
                ['lesson_number', 'ASC']
            ]
        });

        // Fetch all UserLesson records for this user (tracks completion & unlock)
        const userLessons = await UserLesson.findAll({
            where: { user_id: userId }
        });

        const userLessonMap = {};
        for (const ul of userLessons) {
            userLessonMap[ul.lesson_id] = ul;
        }

        // Determine lock/complete status using sequential unlock logic:
        const enriched = lessons.map((lesson, index) => {
            const ul = userLessonMap[lesson.id];
            const isCompleted = ul?.is_completed ?? false;
            const completedWords = ul?.completed_words ?? 0;

            let isLocked;
            if (lesson.lesson_number === 1 || lesson.Deck.hsk_level <= (user.hsk_level || 1)) {
                // Lesson 1 of any deck, or any lesson in a deck at or below the user's starting level, is unlocked by default
                isLocked = false;
            } else {
                // Additional lessons unlock according to progression (previous lesson in same deck completed)
                const prevLesson = lessons.find(l => l.deck_id === lesson.deck_id && l.lesson_number === lesson.lesson_number - 1);
                if (prevLesson) {
                    const prevUl = userLessonMap[prevLesson.id];
                    isLocked = !(prevUl?.is_completed ?? false);
                } else {
                    // If no previous lesson exists in DB, it's unlocked by default
                    isLocked = false;
                }
            }

            return {
                id: lesson.id,
                title: lesson.title,
                lesson_number: lesson.lesson_number,
                Deck: lesson.Deck,
                wordCount: lesson.Vocabularies?.length ?? 0,
                isCompleted,
                isLocked,
                completed_words: completedWords,
            };
        });

        res.json({ lessons: enriched });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        next(error);
    }
};

// 2. GET /api/lessons/:id with vocabulary
export const getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        
        const lesson = await Lesson.findByPk(lessonId, {
            include: [{
                model: Vocabulary,
                attributes: ['id', 'hanzi', 'pinyin', 'definition_en', 'definition_km', 'example_cn', 'example_pinyin', 'example_en', 'example_km']
            }]
        });

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        res.json({ lesson });
    } catch (error) {
        console.error("Error fetching lesson details:", error);
        res.status(500).json({ error: "Failed to fetch lesson details." });
    }
};

// 3. GET /api/lessons/:id/quiz
export const getLessonQuiz = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const quiz = await generateLessonQuiz(lessonId);
        res.json({ quiz });
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        res.status(500).json({ error: "Failed to generate quiz." });
    }
};

// 4. POST /api/lessons/:id/complete (Includes SRS Injection and Next Lesson Unlock)
export const completeLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id; 

        const lesson = await Lesson.findByPk(lessonId, {
            include: [{ model: Deck }]
        });
        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        // 1. Mark lesson as complete
        const [userLesson, created] = await UserLesson.findOrCreate({
            where: { user_id: userId, lesson_id: lessonId },
            defaults: { is_unlocked: true, is_completed: true, completed_at: new Date() }
        });

        if (!created && !userLesson.is_completed) {
            userLesson.is_completed = true;
            userLesson.completed_at = new Date();
            await userLesson.save();
        }

        // 2. Unlock the next lesson in the sequence
        const nextInDeck = await Lesson.findOne({
            where: {
                lesson_number: lesson.lesson_number + 1,
                deck_id: lesson.deck_id
            }
        });

        if (nextInDeck) {
            await UserLesson.findOrCreate({
                where: { user_id: userId, lesson_id: nextInDeck.id },
                defaults: { is_unlocked: true, is_completed: false }
            });
        }

        // 3. >>> THE NEW SRS LOGIC <<<
        const vocabularies = await Vocabulary.findAll({ where: { lesson_id: lessonId } });

        // Set next_review to TODAY so words appear immediately in the review queue
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        for (const vocab of vocabularies) {
            await ReviewSession.findOrCreate({
                where: { user_id: userId, vocab_id: vocab.id },
                defaults: {
                    ease_factor: 2.5,
                    interval_day: 1,
                    repetitions: 0,
                    next_review: today
                }
            });
        }

        res.json({ 
            message: "Lesson complete! Vocabulary added to your review queue.", 
            userLesson 
        });
    } catch (error) {
        console.error("Error completing lesson:", error);
        res.status(500).json({ error: "Failed to complete lesson." });
    }
};

// 5. POST /api/lessons/:id/progress (Update partial progress)
export const updateLessonProgress = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id;
        const { completedWords } = req.body;

        if (completedWords === undefined) {
            return res.status(400).json({ error: "completedWords is required." });
        }

        const [userLesson, created] = await UserLesson.findOrCreate({
            where: { user_id: userId, lesson_id: lessonId },
            defaults: { is_unlocked: true, is_completed: false, completed_words: completedWords }
        });

        if (!created && userLesson.completed_words < completedWords) {
            userLesson.completed_words = completedWords;
            await userLesson.save();
        }

        res.json({ message: "Progress updated successfully." });
    } catch (error) {
        console.error("Error updating lesson progress:", error);
        res.status(500).json({ error: "Failed to update lesson progress." });
    }
};