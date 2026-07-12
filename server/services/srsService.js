/**
 * Customized Spaced Repetition Algorithm
 * Calculates next review date and updates learning parameters
 * @param {Object} currentSession - { repetitions, easeFactor, intervalDays }
 * @param {number} quality - User's rating (1=Again, 2=Hard, 3=Good, 4=Easy)
 * @returns {Object} { repetitions, easeFactor, intervalDays, next_review }
 */
export const calculateNextReview = (currentSession, quality) => {
  // Initialize or extract current values
  let repetitions = currentSession?.repetitions || 0;
  let easeFactor = currentSession?.easeFactor || 2.5;
  let intervalDays = currentSession?.intervalDays || 0;

  if (quality === 1) { // Again (Forgot)
    // stay at Due words the same (meaning intervalDays = 0, next_review is TODAY)
    repetitions = 0;
    intervalDays = 0;
    easeFactor -= 0.2;
  } else if (quality === 2) { // Hard (Hesitated)
    // hard option will repeat the next day
    repetitions = 0;
    intervalDays = 1;
    easeFactor -= 0.15;
  } else if (quality === 3) { // Good (Correct)
    // good option will repeat to review 2 days more
    repetitions += 1;
    intervalDays = 2;
    // ease factor stays roughly same
  } else if (quality === 4) { // Easy (Perfect)
    // easy option will repeat for leaner review again after 3-5 days
    repetitions += 1;
    if (repetitions <= 1) {
      intervalDays = 4; // Between 3-5 days for first successful "Easy"
    } else {
      intervalDays = Math.ceil((intervalDays === 0 ? 1 : intervalDays) * easeFactor);
      if (intervalDays < 3) intervalDays = 3;
    }
    easeFactor += 0.15;
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