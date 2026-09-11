import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api";

export const useLaunchesStore = defineStore("launches", () => {
  const launches = ref([]);
  const launchById = ref(new Map());

  const loading = ref(false);
  const error = ref(null);
  const search = ref("");

  const statusFilter = ref({
    success: true,
    failure: true,
    upcoming: true,
  });
  const yearFilter = ref("all");

  const availableYears = computed(() => {
    const years = new Set(
      launches.value.map((launch) => new Date(launch.date_utc).getFullYear()),
    );
    return [...years].sort((a, b) => b - a);
  });
  function matchesStatus(launch) {
    if (launch.upcoming) {
      return statusFilter.value.upcoming;
    }
    if (launch.success) {
      return statusFilter.value.success;
    }
    return statusFilter.value.failure;
  }
  function matchesYear(launch) {
    if (yearFilter.value === "all") {
      return true;
    }
    return new Date(launch.date_utc).getFullYear() === Number(yearFilter.value);
  }
  const filteredLaunches = computed(() => {
    const term = search.value.trim().toLowerCase();

    return launches.value.filter((launch) => {
      const matchesSearch =
        !term || (launch.name || "").toLowerCase().includes(term);

      return matchesSearch && matchesStatus(launch) && matchesYear(launch);
    });
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

  function setStatusFilter(filters) {
    statusFilter.value = filters;
  }

  function setYear(year) {
    yearFilter.value = year;
  }

  return {
    launches,
    launchById,
    loading,
    error,
    search,
    statusFilter,
    yearFilter,
    availableYears,
    filteredLaunches,
    fetchLaunches,
    fetchLaunch,
    setSearch,
    setStatusFilter,
    setYear,
  };
});
