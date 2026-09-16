import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  `http://${window.location.hostname}:4010/v4`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while talking to the API.";

    alert(`API error: ${message}`);

    return Promise.reject(error);
  },
);

export default api;
