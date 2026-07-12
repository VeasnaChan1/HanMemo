export const calculateNextReviewIntervals = (currentSession) => {
  const currentRepetitions = currentSession?.repetitions || 0;
  const currentEaseFactor = currentSession?.easeFactor || 2.5;
  const currentIntervalDays = currentSession?.intervalDays || 1;

  const getIntervalForQuality = (quality) => {
    let repetitions = currentRepetitions;
    let easeFactor = currentEaseFactor;
    let intervalDays = currentIntervalDays;

    if (quality < 3) {
      repetitions = 0;
      intervalDays = 1;
      easeFactor = easeFactor - 0.2;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.ceil(intervalDays * easeFactor);
      }
    }
    return intervalDays;
  };

  const formatInterval = (quality, days) => {
    if (quality === 1) return "0d"; // User specifically requested "again 0days"
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
