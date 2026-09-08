import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:4010/v4`,
  timeout: 10000,
});

export default api;
