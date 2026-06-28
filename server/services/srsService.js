/**
 * SM-2 Spaced Repetition Algorithm
 * Calculates next review date and updates learning parameters
 * * @param {Object} currentSession - { repetitions, easeFactor, intervalDays }
 * @param {number} quality - User's rating (1=Again, 2=Hard, 3=Good, 4=Easy)
 * @returns {Object} { repetitions, easeFactor, intervalDays, next_review }
 */
export const calculateNextReview = (currentSession, quality) => {
  // Initialize or extract current values
  let repetitions = currentSession?.repetitions || 0;
  let easeFactor = currentSession?.easeFactor || 2.5;
  let intervalDays = currentSession?.intervalDays || 1;

  // Step 1: Check if user forgot (quality < 3)
  // Ratings 1 (Again) and 2 (Hard) both require reset
  if (quality < 3) {
    // Reset back to beginning
    repetitions = 0;
    intervalDays = 1;
    // Decrease ease factor because user struggled
    easeFactor = easeFactor - 0.2;
  } else {
    // User remembered (quality 3 or 4) — advance them
    repetitions += 1;

    // Calculate new interval based on repetition count
    if (repetitions === 1) {
      intervalDays = 1;  // First review: 1 day
    } else if (repetitions === 2) {
      intervalDays = 6;  // Second review: 6 days (SM-2 standard!)
    } else {
      // Third+ review: multiply by ease factor
      intervalDays = Math.ceil(intervalDays * easeFactor);
    }

    // Adjust ease factor based on quality feedback
    // Convert 1-4 scale to SM-2's 0-5 scale
    // 1→0 (Again), 2→1 (Hard), 3→3 (Good), 4→5 (Easy)
    const sm2Quality = quality === 1 ? 0 : quality === 2 ? 1 : quality === 3 ? 3 : 5;
    
    easeFactor = easeFactor + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
  }

  // Enforce minimum ease factor
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const today = new Date();
  const nextReviewDate = new Date(today);
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return {
    repetitions,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    intervalDays,
    next_review: nextReviewDate.toISOString().split('T')[0]  // YYYY-MM-DD format
  };
};