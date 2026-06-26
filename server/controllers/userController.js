import { User } from '../models/index.js';

export const getUserProfile = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] } // Security best practice
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({ user });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch user profile." });
    }
};