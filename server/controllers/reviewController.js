import { Op } from 'sequelize';
import { ReviewSession, Vocabulary } from '../models/index.js';
import { calculateNextReview } from '../services/srsService.js';

// GET /api/reviews/due
export const getDueWords = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        const dueReviews = await ReviewSession.findAll({
            where: {
                user_id: userId,
                next_review: { [Op.lte]: today }
            },
            include: [{
                model: Vocabulary,
                as: 'Vocabulary',
                attributes: [
                    'id', 'hanzi', 'pinyin',
                    'definition_en', 'definition_km',
                    'example_cn', 'example_pinyin',
                    'example_en', 'example_km'
                ]
            }],
            order: [['next_review', 'ASC']]
        });

        // Map to the shape ReviewCard expects
        const cards = dueReviews.map(rs => ({
            reviewSessionId: rs.id,
            id:              rs.Vocabulary?.id,
            character:       rs.Vocabulary?.hanzi        || '',
            pinyin:          rs.Vocabulary?.pinyin       || '',
            translationEn:   rs.Vocabulary?.definition_en || '',
            translationKm:   rs.Vocabulary?.definition_km || '',
            exampleSentence:       rs.Vocabulary?.example_cn     || '',
            exampleSentencePinyin: rs.Vocabulary?.example_pinyin || '',
            exampleTranslationEn:  rs.Vocabulary?.example_en     || '',
            exampleTranslationKm:  rs.Vocabulary?.example_km     || '',
            repetitions:     rs.repetitions,
            easeFactor:      rs.ease_factor,
            intervalDays:    rs.interval_day,
        }));

        res.json(cards);
    } catch (error) {
        console.error('Error fetching due reviews:', error);
        res.status(500).json({ error: 'Failed to fetch due reviews.', details: error.message });
    }
};

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