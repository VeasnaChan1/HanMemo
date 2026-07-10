import { ReviewSession, UserLesson, User } from '../models/index.js';
import { Op } from 'sequelize';

// GET /api/progress
export const getUserProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // End of today for due-reviews check
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Start of today for "studied today" checks
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // 1. Calculate how many reviews are due right now (or overdue)
        const dueReviewsCount = await ReviewSession.count({
            where: {
                user_id: userId,
                next_review: { [Op.lte]: endOfToday }
            }
        });

        // 2. Words learned today (ReviewSession records created today)
        const wordsLearnedTodayCount = await ReviewSession.count({
            where: {
                user_id: userId,
                created_at: { [Op.gte]: startOfToday }
            }
        });

        // 3. Words REVIEWED today (had a rating today, indicated by updated_at)
        const reviewedTodayCount = await ReviewSession.count({
            where: {
                user_id: userId,
                updated_at: { [Op.gte]: startOfToday }
            }
        });

        // 4. Calculate total vocabulary words the user has ever learned
        const totalWordsLearnedCount = await ReviewSession.count({
            where: { user_id: userId }
        });

        // 5. Repetition percentage: percentage of learned words that have been reviewed at least once
        const wordsReviewedAtLeastOnce = await ReviewSession.count({
            where: {
                user_id: userId,
                repetitions: { [Op.gt]: 0 }
            }
        });

        const repetitionPercentage = totalWordsLearnedCount > 0
            ? Math.round((wordsReviewedAtLeastOnce / totalWordsLearnedCount) * 100)
            : 0;

        // 6. Calculate how many lessons are fully completed
        const completedLessonsCount = await UserLesson.count({
            where: { user_id: userId, is_completed: true }
        });

        // Fetch user streak from User table
        const user = await User.findByPk(userId, { attributes: ['streak'] });

        res.json({
            progress: {
                dueReviews: dueReviewsCount,
                wordsLearnedToday: wordsLearnedTodayCount,
                reviewedToday: reviewedTodayCount,
                wordsLearned: totalWordsLearnedCount,
                repetitionPercentage,
                completedLessons: completedLessonsCount,
                streak: user?.streak || 0
            }
        });

    } catch (error) {
        next(error);
    }
};