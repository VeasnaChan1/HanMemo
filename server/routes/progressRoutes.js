import express from 'express';
import { getUserProgress } from '../controllers/progressController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Must be logged in to see progress
router.get('/', authenticate, getUserProgress);

export default router;