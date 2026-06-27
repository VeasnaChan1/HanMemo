import express from 'express';
import { getAllLessons, getLessonById, completeLesson } from '../controllers/lessonController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; 
import { getLessonQuiz } from '../controllers/lessonController.js';
const router = express.Router();

// Require users to be logged in to access learning materials
router.use(authenticate); 

// Route: GET /api/lessons
router.get('/', getAllLessons);

// Route: GET /api/lessons/:id
router.get('/:id', getLessonById);

// Route: POST /api/lessons/:id/complete
router.post('/:id/complete', completeLesson);

// Route: GET /api/lessons/:id/quiz
router.get('/:id/quiz', getLessonQuiz);

export default router;