import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js'; 
import { 
    createLesson, 
    updateLesson, 
    deleteLesson, 
    createVocabulary, 
    updateVocabulary, 
    deleteVocabulary 
} from '../controllers/adminController.js';

const router = express.Router();

// 1. Protect all routes in this file (must be logged in)
router.use(authenticate);

// 2. Authorize roles (must be an admin or a teacher)
// Anyone with role 'learner' will get a 403 Forbidden error automatically!
router.use(authorizeRoles('admin', 'teacher'));

// Lesson Routes
router.post('/lessons', createLesson);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Vocabulary Routes
router.post('/vocabulary', createVocabulary);
router.patch('/vocabulary/:id', updateVocabulary);
router.delete('/vocabulary/:id', deleteVocabulary);

export default router;