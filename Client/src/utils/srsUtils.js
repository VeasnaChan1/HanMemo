export const calculateNextReviewIntervals = (currentSession) => {
  const currentRepetitions = currentSession?.repetitions || 0;
  const currentEaseFactor = currentSession?.easeFactor || 2.5;
  const currentIntervalDays = currentSession?.intervalDays || 0;

  const getIntervalForQuality = (quality) => {
    let repetitions = currentRepetitions;
    let easeFactor = currentEaseFactor;
    let intervalDays = currentIntervalDays;

    if (quality === 1) { // Again (Forgot)
      intervalDays = 1;
    } else if (quality === 2) { // Hard (Hesitated)
      if (currentRepetitions === 0) {
        intervalDays = 1;
      } else {
        intervalDays = Math.ceil((currentIntervalDays === 0 ? 1 : currentIntervalDays) * 1.2);
        const goodInterval = Math.ceil(currentIntervalDays * easeFactor);
        if (intervalDays >= goodInterval && goodInterval > 1) {
          intervalDays = Math.max(1, goodInterval - 1);
        }
      }
    } else if (quality === 3) { // Good (Correct)
      repetitions += 1;
      if (repetitions === 1) {
        intervalDays = 2; // 1st correct: 2 days (gives a clear distinction from Hard = 1d)
      } else if (repetitions === 2) {
        intervalDays = 4;
      } else {
        intervalDays = Math.ceil(intervalDays * easeFactor);
      }
    } else if (quality === 4) { // Easy (Perfect)
      repetitions += 1;
      if (repetitions === 1) {
        intervalDays = 4;
      } else {
        intervalDays = Math.ceil(intervalDays * easeFactor * 1.3);
      }
    }
    return intervalDays;
  };

  const formatInterval = (quality, days) => {
    if (days < 30) return `${days}d`;
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months}m`;
    }
    const years = (days / 365).toFixed(1);
    return `${years}y`;
  };

  return {
    1: formatInterval(1, getIntervalForQuality(1)),
    2: formatInterval(2, getIntervalForQuality(2)),
    3: formatInterval(3, getIntervalForQuality(3)),
    4: formatInterval(4, getIntervalForQuality(4)),
  };
};
