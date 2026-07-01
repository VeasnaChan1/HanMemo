import express from 'express';
import { getAllLessons, getLessonById, completeLesson } from '../controllers/lessonController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; 
import { getLessonQuiz } from '../controllers/lessonController.js';
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Lessons
 *     description: Lesson, quiz, and completion endpoints
 */

// Require users to be logged in to access learning materials
router.use(authenticate); 

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of available lessons
 *       401:
 *         description: Unauthorized
 */
// Route: GET /api/lessons
router.get('/', getAllLessons);

/**
 * @openapi
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson details with vocabulary
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson details and vocabulary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 */
// Route: GET /api/lessons/:id
router.get('/:id', getLessonById);

/**
 * @openapi
 * /api/lessons/{id}/complete:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 */
// Route: POST /api/lessons/:id/complete
router.post('/:id/complete', completeLesson);

/**
 * @openapi
 * /api/lessons/{id}/quiz:
 *   get:
 *     summary: Generate a quiz for a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 */
// Route: GET /api/lessons/:id/quiz
router.get('/:id/quiz', getLessonQuiz);

export default router;