import express from 'express';
import { body } from 'express-validator';
import { getDueWords, rateReview } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();
router.use(authenticate);

// Route: GET /api/reviews/due
router.get('/due', getDueWords);

// Route: POST /api/reviews/rate
router.post('/rate', 
    [
        body('reviewSessionId').isInt().withMessage('Review Session ID must be an integer.'),
        body('rating').isInt({ min: 1, max: 4 }).withMessage('Rating must be an integer between 1 and 4.')
    ],
    validateRequest, 
    rateReview
);

export default router;