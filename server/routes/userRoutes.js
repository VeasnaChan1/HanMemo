import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // Adjust name if yours is different

const router = express.Router();

// The 'authenticate' middleware ensures only logged-in users can access this
router.get('/profile', authenticate, getUserProfile);

export default router;

