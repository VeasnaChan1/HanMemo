import express from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authLimiter } from '../middlewares/rateLimiter.js'; // Brute force protection

const router = express.Router();

router.post('/register', [
    authLimiter,
    // Validation AND Sanitization
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required').escape()
], validateRequest, register);

router.post('/login', [
    authLimiter,
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
], validateRequest, login);

export default router;