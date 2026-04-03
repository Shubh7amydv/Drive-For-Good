import axios from "axios";

const envBaseURL = import.meta.env.VITE_API_URL;
const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
const fallbackBaseURLs = envBaseURL
  ? [envBaseURL]
  : [`http://${host}:5000/api`, `http://${host}:5001/api`];

export const api = axios.create({
  baseURL: fallbackBaseURLs[0]
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isNetworkError = !error.response;

    if (!isNetworkError || !originalRequest || originalRequest.__retriedWithFallback) {
      return Promise.reject(error);
    }

    const currentBaseURL = originalRequest.baseURL || api.defaults.baseURL;
    const nextBaseURL = fallbackBaseURLs.find((url) => url !== currentBaseURL);

    if (!nextBaseURL) {
      return Promise.reject(error);
    }

    originalRequest.__retriedWithFallback = true;
    originalRequest.baseURL = nextBaseURL;
    api.defaults.baseURL = nextBaseURL;

    return api.request(originalRequest);
  }
);

export function withAuthHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}
