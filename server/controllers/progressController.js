import { ReviewSession, UserLesson } from '../models/index.js';
import { Op } from 'sequelize';

// GET /api/progress
export const getUserProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Start of today (midnight) for accurate date comparisons
        const today = new Date();
        today.setHours(23, 59, 59, 999); 

        // 1. Calculate how many reviews are due right now
        const dueReviewsCount = await ReviewSession.count({
            where: {
                user_id: userId,
                next_review: { [Op.lte]: today } // Less than or equal to today
            }
        });

        // 2. Calculate total vocabulary words the user has started learning
        const wordsLearnedCount = await ReviewSession.count({
            where: { user_id: userId }
        });

        // 3. Calculate how many lessons are fully completed
        const completedLessonsCount = await UserLesson.count({
            where: { user_id: userId, is_completed: true }
        });

        res.json({
            progress: {
                dueReviews: dueReviewsCount,
                wordsLearned: wordsLearnedCount,
                completedLessons: completedLessonsCount
            }
        });

    } catch (error) {
        // Passing the error to 'next' triggers the global error handler!
        next(error); 
    }
};