import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
    // Stats
    getDashboardStats,
    // Deck CRUD
    getDecks, createDeck, updateDeck, deleteDeck,
    // Lesson CRUD
    getLessons, createLesson, updateLesson, deleteLesson,
    // Vocabulary CRUD
    getVocabulary, createVocabulary, updateVocabulary, deleteVocabulary,
    // User Management
    getUsers, createUser, updateUser, deleteUser,
} from '../controllers/adminController.js';

const router = express.Router();

// 1. Protect all routes (must be logged in)
router.use(authenticate);

// 2. Authorize roles (admin or teacher only)
router.use(authorizeRoles('admin', 'teacher'));

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Deck Routes
router.get('/decks', getDecks);
router.post('/decks', createDeck);
router.patch('/decks/:id', updateDeck);
router.delete('/decks/:id', deleteDeck);

// Lesson Routes
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Vocabulary Routes
router.get('/vocabulary', getVocabulary);
router.post('/vocabulary', createVocabulary);
router.patch('/vocabulary/:id', updateVocabulary);
router.delete('/vocabulary/:id', deleteVocabulary);

// User Management Routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;