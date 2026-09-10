import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api";

export const useLaunchesStore = defineStore("launches", () => {
  const launches = ref([]);
  const launchById = ref(new Map());

  const loading = ref(false);
  const error = ref(null);
  const search = ref("");

  const filteredLaunches = computed(() => {
    const term = search.value.trim().toLowerCase();

    if (!term) {
      return launches.value;
    }

    return launches.value.filter((launch) =>
      (launch.name || "").toLowerCase().includes(term),
    );
  });

  async function fetchLaunches() {
    if (launches.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/launches");

      // console.log("LAUNCHES RESPONSE:", response.data);

      launches.value = response.data;

      response.data.forEach((launch) => {
        launchById.value.set(launch.id, launch);
      });
    } catch (err) {
      error.value =
        "It's not possible load the launches. Please try again later!";
    } finally {
      loading.value = false;
    }
  }

  async function fetchLaunch(id) {
    if (launchById.value.has(id)) {
      return launchById.value.get(id);
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/launches/${id}`);

      const launch = response.data;

      launchById.value.set(id, launch);

      return launch;
    } catch (err) {
      error.value =
        "It's not possible load the launches. Please try again later!";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setSearch(value) {
    search.value = value;
  }

  return {
    launches,
    launchById,
    loading,
    error,
    search,
    filteredLaunches,
    fetchLaunches,
    fetchLaunch,
    setSearch,
  };
});
