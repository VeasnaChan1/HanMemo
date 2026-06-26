import { Lesson, Vocabulary, UserLesson } from '../models/index.js';

// 1. Implement GET /api/lessons
export const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll({
            order: [['lesson_number', 'ASC']] // Keep them in logical order
        });
        res.json({ lessons });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons." });
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

// 3. Start lesson completion logic (POST /api/lessons/:id/complete)
export const completeLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id; // Comes from authMiddleware

        // Check if the lesson actually exists first
        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        // Find existing progress or create a new record
        const [userLesson, created] = await UserLesson.findOrCreate({
            where: { user_id: userId, lesson_id: lessonId },
            defaults: {
                is_unlocked: true,
                is_completed: true,
                completed_at: new Date()
            }
        });

        // If it already existed but wasn't completed, update it
        if (!created && !userLesson.is_completed) {
            userLesson.is_completed = true;
            userLesson.completed_at = new Date();
            await userLesson.save();
        }

        res.json({ 
            message: "Lesson marked as complete!", 
            userLesson 
        });
    } catch (error) {
        console.error("Error completing lesson:", error);
        res.status(500).json({ error: "Failed to complete lesson." });
    }
};