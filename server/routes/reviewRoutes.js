import express from 'express';
import { body } from 'express-validator';
import { rateReview } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();
router.use(authenticate);

// Route: POST /api/reviews/rate
// We add validation rules in an array before the controller!
router.post('/rate', 
    [
        body('reviewSessionId').isInt().withMessage('Review Session ID must be an integer.'),
        body('rating').isInt({ min: 1, max: 4 }).withMessage('Rating must be an integer between 1 and 4.')
    ],
    validateRequest, 
    rateReview
);

export default router;