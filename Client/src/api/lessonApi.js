import API from "./axios";

export const lessonApi = {
  getLessons: async (hskLevel) => {
    // hskLevel: optional number — must match backend's req.query.hsk_level
    const params = {};
    if (hskLevel) {
      params.hsk_level = String(hskLevel);
    }
    const response = await API.get("/lessons", { params });
    return response.data.lessons || [];
  },

  getLessonById: async (lessonId) => {
    const response = await API.get(`/lessons/${lessonId}`);
    return response.data.lesson;
  },

  getLessonQuiz: async (lessonId) => {
    const response = await API.get(`/lessons/${lessonId}/quiz`);
    return response.data.quiz;
  },

  completeLesson: async (lessonId) => {
    const response = await API.post(`/lessons/${lessonId}/complete`);
    return response.data;
  },

  updateLessonProgress: async (lessonId, completedWords) => {
    const response = await API.post(`/lessons/${lessonId}/progress`, { completedWords });
    return response.data;
  },
};
