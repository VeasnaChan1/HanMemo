import API from "./axios";

export const authApi = {
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.patch("/users/profile", profileData);
    return response.data;
  },
};
