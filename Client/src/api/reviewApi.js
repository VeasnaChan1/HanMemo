import axiosInstance from "./axios";

export const reviewApi = {
  // Fetch due words for today's active study panel block
  getDueWords: () => axiosInstance.get("/reviews/due"),

  // Send feedback quality score down to backend database calculators
  submitCardRating: (vocabularyId, rating) =>
    axiosInstance.post("/reviews/rate", { vocabularyId, rating }),
};
