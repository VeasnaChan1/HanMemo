import { Lesson, Vocabulary, Deck, User } from '../models/index.js';
import { Op } from 'sequelize';

// ==========================================
// DASHBOARD STATS
// ==========================================

// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
    try {
        const [totalDecks, totalLessons, totalVocabulary, totalUsers] = await Promise.all([
            Deck.count(),
            Lesson.count(),
            Vocabulary.count(),
            User.count(),
        ]);
        res.json({ totalDecks, totalLessons, totalVocabulary, totalUsers });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

// ==========================================
// DECK CRUD OPERATIONS
// ==========================================

// GET /api/admin/decks
export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.findAll({
            include: [
                { model: Lesson, attributes: ['id'] },
                { model: Vocabulary, attributes: ['id'] },
            ],
            order: [['hsk_level', 'ASC']],
        });
        const formatted = decks.map(d => ({
            id: d.id,
            title: d.title,
            hsk_level: d.hsk_level,
            description: d.description,
            lessonCount: d.Lessons ? d.Lessons.length : 0,
            wordCount: d.Vocabularies ? d.Vocabularies.length : 0,
            created_at: d.created_at,
        }));
        res.json({ decks: formatted });
    } catch (error) {
        console.error('Error fetching decks:', error);
        res.status(500).json({ error: 'Failed to fetch decks' });
    }
};

// POST /api/admin/decks
export const createDeck = async (req, res) => {
    try {
        const { title, hsk_level, description } = req.body;
        const newDeck = await Deck.create({ title, hsk_level, description });
        res.status(201).json({ message: 'Deck created successfully', deck: newDeck });
    } catch (error) {
        console.error('Error creating deck:', error);
        res.status(500).json({ error: 'Failed to create deck', details: error.message });
    }
};

// PATCH /api/admin/decks/:id
export const updateDeck = async (req, res) => {
    try {
        const deck = await Deck.findByPk(req.params.id);
        if (!deck) return res.status(404).json({ error: 'Deck not found.' });
        await deck.update(req.body);
        res.json({ message: 'Deck updated successfully', deck });
    } catch (error) {
        console.error('Error updating deck:', error);
        res.status(500).json({ error: 'Failed to update deck', details: error.message });
    }
};

// DELETE /api/admin/decks/:id
export const deleteDeck = async (req, res) => {
    try {
        const deck = await Deck.findByPk(req.params.id);
        if (!deck) return res.status(404).json({ error: 'Deck not found.' });
        await deck.destroy();
        res.json({ message: 'Deck deleted successfully.' });
    } catch (error) {
        console.error('Error deleting deck:', error);
        res.status(500).json({ error: 'Failed to delete deck', details: error.message });
    }
};

// ==========================================
// LESSON CRUD OPERATIONS
// ==========================================

// GET /api/admin/lessons
export const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll({
            include: [{ model: Deck, attributes: ['title', 'hsk_level'] }],
            order: [['lesson_number', 'ASC']],
        });
        res.json({ lessons });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};

// POST /api/admin/lessons
export const createLesson = async (req, res) => {
    try {
        const { deck_id, title, lesson_number } = req.body;
        const newLesson = await Lesson.create({ deck_id, title, lesson_number });
        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Failed to create lesson', details: error.message });
    }
};

// PATCH /api/admin/lessons/:id
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
        await lesson.update(req.body);
        res.json({ message: 'Lesson updated successfully', lesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ error: 'Failed to update lesson', details: error.message });
    }
};

// DELETE /api/admin/lessons/:id (WITH CASCADE)
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
        await Vocabulary.destroy({ where: { lesson_id: id } });
        await lesson.destroy();
        res.json({ message: 'Lesson and all associated vocabulary successfully deleted.' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ error: 'Failed to delete lesson', details: error.message });
    }
};

// ==========================================
// VOCABULARY CRUD OPERATIONS
// ==========================================

// GET /api/admin/vocabulary
export const getVocabulary = async (req, res) => {
    try {
        const { page = 1, limit = 10, hsk, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};
        if (hsk) where.hsk_level = hsk;
        if (search) {
            where[Op.or] = [
                { hanzi: { [Op.like]: `%${search}%` } },
                { pinyin: { [Op.like]: `%${search}%` } },
                { definition_en: { [Op.like]: `%${search}%` } },
            ];
        }
        const { count, rows } = await Vocabulary.findAndCountAll({
            where,
            include: [{ model: Lesson, attributes: ['title', 'lesson_number'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']],
        });
        res.json({ total: count, page: parseInt(page), vocabulary: rows });
    } catch (error) {
        console.error('Error fetching vocabulary:', error);
        res.status(500).json({ error: 'Failed to fetch vocabulary' });
    }
};

// POST /api/admin/vocabulary
export const createVocabulary = async (req, res) => {
    try {
        const newVocab = await Vocabulary.create(req.body);
        res.status(201).json({ message: 'Vocabulary added successfully', vocab: newVocab });
    } catch (error) {
        console.error('Error creating vocabulary:', error);
        res.status(500).json({ error: 'Failed to create vocabulary', details: error.message });
    }
};

// PATCH /api/admin/vocabulary/:id
export const updateVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const vocab = await Vocabulary.findByPk(id);
        if (!vocab) return res.status(404).json({ error: 'Vocabulary not found.' });
        await vocab.update(req.body);
        res.json({ message: 'Vocabulary updated successfully', vocab });
    } catch (error) {
        console.error('Error updating vocabulary:', error);
        res.status(500).json({ error: 'Failed to update vocabulary', details: error.message });
    }
};

// DELETE /api/admin/vocabulary/:id
export const deleteVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const vocab = await Vocabulary.findByPk(id);
        if (!vocab) return res.status(404).json({ error: 'Vocabulary not found.' });
        await vocab.destroy();
        res.json({ message: 'Vocabulary word deleted successfully.' });
    } catch (error) {
        console.error('Error deleting vocabulary:', error);
        res.status(500).json({ error: 'Failed to delete vocabulary', details: error.message });
    }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

// GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] },
            order: [['id', 'ASC']],
        });
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        await user.destroy();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
};