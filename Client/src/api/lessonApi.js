import API from "./axios";

export const lessonApi = {
  getLessons: async (levels) => {
    // levels: optional array or comma-separated string like "1,2,3,4"
    const params = {};
    if (levels) {
      if (Array.isArray(levels)) params.levels = levels.join(",");
      else params.levels = String(levels);
    }
    const response = await API.get("/lessons", { params });
    return response.data.lessons || [];
  },

  getLessonById: async (lessonId) => {
    const response = await API.get(`/lessons/${lessonId}`);
    return response.data.lesson;
  },
};
