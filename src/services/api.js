import axios from "axios";
import { useToastStore } from "../store/ui/toast";
import { i18n } from "../i18n";

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
    const { t } = i18n.global;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      t("errors.apiGeneric");

    useToastStore().showError(t("errors.api", { message }));

    return Promise.reject(error);
  },
);

export default api;
