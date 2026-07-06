import express from 'express';
import { getUserProfile,  updateUserProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // Adjust name if yours is different

const router = express.Router();

// The 'authenticate' middleware ensures only logged-in users can access this
// >>> NEW: Add the PATCH route for updating profile <<<
router.patch('/profile', authenticate, updateUserProfile);
router.get('/profile', authenticate, getUserProfile);

export default router;

