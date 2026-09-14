import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  `http://${window.location.hostname}:4010/v4`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;
