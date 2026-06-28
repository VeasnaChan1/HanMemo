import { ReviewSession } from '../models/index.js';
import { calculateNextReview } from '../services/srsService.js';

// POST /api/reviews/rate
export const rateReview = async (req, res) => {
    try {
        const { reviewSessionId, rating } = req.body;
        const userId = req.user.id;

        // Validate input
        if (![1, 2, 3, 4].includes(rating)) {
            return res.status(400).json({ error: "Rating must be 1, 2, 3, or 4." });
        }

        // Find the specific flashcard review session
        const review = await ReviewSession.findOne({
            where: { id: reviewSessionId, user_id: userId }
        });

        if (!review) {
            return res.status(404).json({ error: "Review session not found." });
        }

        // Package the current stats for your algorithm
        const currentSession = {
            repetitions: review.repetitions,
            easeFactor: review.ease_factor,
            intervalDays: review.interval_day
        };

        // Run your SM-2 logic
        const srsData = calculateNextReview(currentSession, rating);

        // Update the database record
        review.ease_factor = srsData.easeFactor;
        review.interval_day = srsData.intervalDays;
        review.repetitions = srsData.repetitions;
        review.next_review = new Date(srsData.next_review); 

        await review.save();

        res.json({
            message: "Review successfully rated.",
            updatedReview: review
        });

    } catch (error) {
        console.error("Error rating review:", error);
        res.status(500).json({ error: "Failed to process review rating.", details: error.message });
    }
};