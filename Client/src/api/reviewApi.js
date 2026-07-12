import axiosInstance from "./axios";

export const reviewApi = {
  // Fetch due words for today's active study panel block
  getDueWords: () =>
    axiosInstance.get("/reviews/due").then((res) => res.data),

  // Send feedback quality score down to backend database calculators
  submitCardRating: (reviewSessionId, rating) =>
    axiosInstance.post("/reviews/rate", { reviewSessionId, rating }),
};
