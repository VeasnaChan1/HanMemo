import express from 'express';
import { rateReview } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticate);

// Route: POST /api/reviews/rate
router.post('/rate', rateReview);

export default router;