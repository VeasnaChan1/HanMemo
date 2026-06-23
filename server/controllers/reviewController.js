const { Vocabulary, UserLesson, Sequelize } = require("../models");
const { calculateNextReview } = require("../services/srsService");
const { Op } = Sequelize;

/**
 * Fetch all words due for review today or overdue based on user scheduling tables
 */
const getDueReviews = async (req, res, next) => {
  try {
    const userId = req.user.id; // Populated securely via authMiddleware interceptor
    const rightNow = new Date();

    // Query for user item states where nextReviewDate <= current systemic datetime stamp
    const dueCards = await UserLesson.findAll({
      where: {
        userId,
        nextReviewDate: {
          [Op.lte]: rightNow,
        },
      },
      include: [{ model: Vocabulary, as: "vocabularyDetails" }],
      order: [["nextReviewDate", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      count: dueCards.length,
      data: dueCards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle score review rating events from user interactions
 */
const rateCardSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { vocabularyId, rating } = req.body; // collected from client payload mapping

    if (!vocabularyId || !rating || rating < 1 || rating > 4) {
      return res
        .status(400)
        .json({ message: "Invalid parameters or rating scale missing." });
    }

    // Lookup tracking state or build one if first time encountering item
    let userWordState = await UserLesson.findOne({
      where: { userId, vocabularyId },
    });

    if (!userWordState) {
      userWordState = await UserLesson.create({
        userId,
        vocabularyId,
        repetitions: 0,
        easeFactor: 2.5,
        intervalDays: 1,
        nextReviewDate: new Date(),
      });
    }

    // Process new calendar steps inside the specialized algorithm service
    const { repetitions, easeFactor, intervalDays } = calculateNextReview(
      userWordState,
      rating,
    );

    // Compute calendar tracking timestamps offset by interval configurations
    const calculatedNextReviewDate = new Date();
    calculatedNextReviewDate.setDate(
      calculatedNextReviewDate.getDate() + intervalDays,
    );

    // Mutate record attributes securely
    await userWordState.update({
      repetitions,
      easeFactor,
      intervalDays,
      nextReviewDate: calculatedNextReviewDate,
      lastReviewedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "SRS scheduler successfully updated memory matrix intervals.",
      nextReviewInDays: intervalDays,
      nextReviewDate: calculatedNextReviewDate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDueReviews,
  rateCardSession,
};
