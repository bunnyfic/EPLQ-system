import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach the saved JWT to every request automatically (needed for /profile)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (data) => api.post("/auth/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const activateAccount = (data) => api.post("/auth/activate", data);

export const getProfile = () => api.get("/profile");
export const saveProfile = (formData) =>
  api.post("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  export const searchLocations = (params) =>
  api.get("/locations/search", { params });

export default api;