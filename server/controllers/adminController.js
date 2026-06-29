import { Lesson, Vocabulary } from '../models/index.js';

// ==========================================
// LESSON CRUD OPERATIONS
// ==========================================

// POST /api/admin/lessons
export const createLesson = async (req, res) => {
    try {
        const { deck_id, title, lesson_number, description } = req.body;
        
        const newLesson = await Lesson.create({ 
            deck_id, 
            title, 
            lesson_number, 
            description 
        });

        res.status(201).json({ message: "Lesson created successfully", lesson: newLesson });
    } catch (error) {
        console.error("Error creating lesson:", error);
        res.status(500).json({ error: "Failed to create lesson", details: error.message });
    }
};

// PATCH /api/admin/lessons/:id
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        // Sequelize's .update() dynamically updates only the fields provided in req.body
        await lesson.update(req.body);
        
        res.json({ message: "Lesson updated successfully", lesson });
    } catch (error) {
        console.error("Error updating lesson:", error);
        res.status(500).json({ error: "Failed to update lesson", details: error.message });
    }
};

// DELETE /api/admin/lessons/:id (WITH CASCADE)
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        // MANUAL CASCADE: Delete all vocabulary associated with this lesson first
        // This prevents orphaned flashcards from breaking the SRS engine
        await Vocabulary.destroy({ where: { lesson_id: id } });

        // Now safe to delete the lesson itself
        await lesson.destroy();

        res.json({ message: "Lesson and all associated vocabulary successfully deleted." });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        res.status(500).json({ error: "Failed to delete lesson", details: error.message });
    }
};

// ==========================================
// VOCABULARY CRUD OPERATIONS
// ==========================================

// POST /api/admin/vocabulary
export const createVocabulary = async (req, res) => {
    try {
        const newVocab = await Vocabulary.create(req.body);
        res.status(201).json({ message: "Vocabulary added successfully", vocab: newVocab });
    } catch (error) {
        console.error("Error creating vocabulary:", error);
        res.status(500).json({ error: "Failed to create vocabulary", details: error.message });
    }
};

// PATCH /api/admin/vocabulary/:id
export const updateVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const vocab = await Vocabulary.findByPk(id);

        if (!vocab) return res.status(404).json({ error: "Vocabulary not found." });

        await vocab.update(req.body);
        res.json({ message: "Vocabulary updated successfully", vocab });
    } catch (error) {
        console.error("Error updating vocabulary:", error);
        res.status(500).json({ error: "Failed to update vocabulary", details: error.message });
    }
};

// DELETE /api/admin/vocabulary/:id
export const deleteVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const vocab = await Vocabulary.findByPk(id);

        if (!vocab) return res.status(404).json({ error: "Vocabulary not found." });

        await vocab.destroy();
        res.json({ message: "Vocabulary word deleted successfully." });
    } catch (error) {
        console.error("Error deleting vocabulary:", error);
        res.status(500).json({ error: "Failed to delete vocabulary", details: error.message });
    }
};