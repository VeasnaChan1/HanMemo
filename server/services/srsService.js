/**
 * Spaced Repetition System (SRS) Engine utilizing an optimized SM-2 Algorithm variant.
 * * @param {Object} vocabularySession - The current user-vocabulary tracking state record
 * @param {number} quality - Feedback score given by user (1: Again, 2: Hard, 3: Good, 4: Easy)
 * @returns {Object} Updated interval variables { repetitions, easeFactor, intervalDays }
 */
const calculateNextReview = (vocabularySession, quality) => {
  // Extract or default baseline matrix variables
  let repetitions = vocabularySession?.repetitions || 0;
  let easeFactor = vocabularySession?.easeFactor || 2.5; // Default standard baseline multiplier
  let intervalDays = 1;

  // Evaluation Rule: If the user forgets the word ('Again'), drop the streak loops completely
  if (quality === 1) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Increment valid consecutive successful repetitions
    repetitions += 1;

    if (repetitions === 1) {
      intervalDays = 1; // Unlocked breakthrough step 1: 1 day gap
    } else if (repetitions === 2) {
      intervalDays = 4; // Step 2: 4 days gap
    } else {
      // Step 3+: Scale exponentially using the item's calculated Ease Factor
      intervalDays = Math.ceil(
        (vocabularySession?.intervalDays || 1) * easeFactor,
      );
    }

    // Dynamic adjustment of EF based on user feedback difficulty
    // Mapping qualities to traditional SM-2 metrics adjustments:
    // (quality - 1) shifts standard scales from [1-4] values into standard math multipliers
    const qualityScoreMap = { 2: 3, 3: 4, 4: 5 }; // Normalizes 4-button layout scale to SM-2 quality metrics [0-5]
    const sm2Quality = qualityScoreMap[quality] || 3;

    easeFactor =
      easeFactor + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
  }

  // Enforce a hard lower boundary constraint threshold limit for the EF variable
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    repetitions,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    intervalDays,
  };
};

module.exports = {
  calculateNextReview,
};
