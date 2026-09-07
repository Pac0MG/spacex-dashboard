import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";

export const useRocketsStore = defineStore("rockets", () => {
  const rockets = ref([]);
  const rocketById = ref(new Map());

  const loading = ref(false);
  const error = ref(null);

  async function fetchRockets(force = false) {
    if (rockets.value.length > 0 && !force) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/rockets");

      rockets.value = response.data;

      response.data.forEach((rocket) => {
        rocketById.value.set(rocket.id, rocket);
      });
    } catch (err) {
      error.value =
        "It's not possible load the launches. Please try again later!";
    } finally {
      loading.value = false;
    }
  }

  async function fetchRocket(id) {
    if (rocketById.value.has(id)) {
      return rocketById.value.get(id);
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/rockets/${id}`);

      const rocket = response.data;

      rocketById.value.set(id, rocket);

      return rocket;
    } catch (err) {
      error.value =
        "It's not possible load the launches. Please try again later!";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    rockets,
    rocketById,
    loading,
    error,
    fetchRockets,
    fetchRocket,
  };
});
