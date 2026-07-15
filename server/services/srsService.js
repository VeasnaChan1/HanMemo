/**
 * Customized Spaced Repetition Algorithm (Anki/Obsidian-style SM-2)
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
    repetitions = 0;
    intervalDays = 1; // Review tomorrow
    easeFactor = Math.max(1.3, easeFactor - 0.20);
  } else if (quality === 2) { // Hard (Hesitated)
    repetitions = 0;
    // Hard interval is 1.2x the previous interval (minimum 1 day)
    intervalDays = Math.ceil((intervalDays === 0 ? 1 : intervalDays) * 1.2);
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (quality === 3) { // Good (Correct)
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1; // 1st correct: 1 day
    } else if (repetitions === 2) {
      intervalDays = 4; // 2nd correct: 4 days (Anki's default graduation interval)
    } else {
      intervalDays = Math.ceil(intervalDays * easeFactor);
    }
    // Ease factor remains unchanged
  } else if (quality === 4) { // Easy (Perfect)
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 4; // Starting interval for Easy is 4 days
    } else {
      // Easy interval is interval * easeFactor * 1.3 (Easy bonus)
      intervalDays = Math.ceil(intervalDays * easeFactor * 1.3);
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