import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"}/api/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;

    if (typeof responseData === "string") {
      return Promise.reject(Object.assign(new Error(responseData), { response: error.response }));
    }

    if (responseData?.error) {
      return Promise.reject(Object.assign(new Error(responseData.error), { response: error.response }));
    }

    if (responseData?.message) {
      return Promise.reject(Object.assign(new Error(responseData.message), { response: error.response }));
    }

    return Promise.reject(error);
  }
);

export default api;
