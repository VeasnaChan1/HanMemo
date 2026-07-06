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

// >>> NEW: Add this function below getUserProfile <<<
export const updateUserProfile = async (req, res, next) => {
    try {
        const { hsk_level } = req.body;
        
        // Find the user
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update the HSK level if provided
        if (hsk_level) {
            user.hsk_level = hsk_level;
        }

        await user.save();

        res.json({ 
            message: "Profile updated successfully!", 
            user: {
                id: user.id,
                name: user.name,
                hsk_level: user.hsk_level
            }
        });
    } catch (error) {
        // Send to global error handler
        next(error);
    }
};