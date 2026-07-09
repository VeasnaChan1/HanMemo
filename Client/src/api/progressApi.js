import API from "./axios";

export const progressApi = {
  getProgress: async () => {
    const response = await API.get("/progress");
    return response.data.progress;
  },
};
