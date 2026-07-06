import { Lesson, Vocabulary, UserLesson, ReviewSession } from '../models/index.js';
import { generateLessonQuiz } from '../services/quizService.js';

// 1. Implement GET /api/lessons
// export const getAllLessons = async (req, res) => {
//     try {
//         const lessons = await Lesson.findAll({
//             order: [['lesson_number', 'ASC']] // Keep them in logical order
//         });
//         res.json({ lessons });
//     } catch (error) {
//         console.error("Error fetching lessons:", error);
//         res.status(500).json({ error: "Failed to fetch lessons." });
//     }
// };


// 1. Implement GET /api/lessons (UPDATED for HSK Filtering)
export const getAllLessons = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch the logged-in user to see what HSK level they selected
        const user = await User.findByPk(userId);

        // Fetch lessons that belong to Decks matching the user's HSK level
        const lessons = await Lesson.findAll({
            include: [{
                model: Deck,
                where: { hsk_level: user.hsk_level },
                attributes: ['title', 'hsk_level'] // Optional: include deck info
            }],
            order: [['lesson_number', 'ASC']]
        });

        res.json({ lessons });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        // Using next(error) passes it to your global error handler!
        next(error);
    }
};
// 2. Implement GET /api/lessons/:id with vocabulary
export const getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        
        const lesson = await Lesson.findByPk(lessonId, {
            include: [{
                model: Vocabulary,
                attributes: ['id', 'hanzi', 'pinyin', 'definition_en', 'definition_km'] 
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

// 4. POST /api/lessons/:id/complete (Includes SRS Injection)
export const completeLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id; 

        const lesson = await Lesson.findByPk(lessonId);
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

        // 2. >>> THE NEW SRS LOGIC <<<
        // Fetch all vocabulary for this lesson
        const vocabularies = await Vocabulary.findAll({ where: { lesson_id: lessonId } });

        // Calculate tomorrow's date for the first review
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Inject each word into the review_sessions table
        for (const vocab of vocabularies) {
            await ReviewSession.findOrCreate({
                where: { user_id: userId, vocab_id: vocab.id },
                defaults: {
                    ease_factor: 2.5,       // Default SM-2 starting ease
                    interval_day: 1,        // Review again in 1 day
                    repetitions: 0,
                    next_review: tomorrow   // Due tomorrow
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