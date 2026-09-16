import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api";
import { useFavoritesStore } from "./favorites";

export const useLaunchesStore = defineStore("launches", () => {
  const favoritesStore = useFavoritesStore();

  const launches = ref([]);
  const launchById = ref(new Map());

  const loading = ref(false);
  const error = ref(null);
  const search = ref("");
  const searchType = ref("name");

  const statusFilter = ref({
    success: true,
    failure: true,
    upcoming: true,
  });
  const yearFilter = ref("all");
  const favoritesOnly = ref(false);

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
  function matchesFavorites(launch) {
    if (!favoritesOnly.value) {
      return true;
    }
    return favoritesStore.isFavorite(launch.id);
  }

  function matchesSearchTerm(launch, term) {
    if (!term) {
      return true;
    }

    if (searchType.value === "year") {
      const year = new Date(launch.date_utc).getFullYear().toString();
      return year.includes(term);
    }

    return (launch.name || "").toLowerCase().includes(term);
  }
  const filteredLaunches = computed(() => {
    const term = search.value.trim().toLowerCase();

    return launches.value.filter((launch) => {
      return (
        matchesSearchTerm(launch, term) &&
        matchesStatus(launch) &&
        matchesYear(launch) &&
        matchesFavorites(launch)
      );
    });
  });

  // Closest upcoming launch that hasn't happened yet, regardless of the
  // active search/filters - used for the "next launch" hero.
  const nextLaunch = computed(() => {
    const now = Date.now();

    const upcoming = launches.value
      .filter(
        (launch) =>
          launch.upcoming && new Date(launch.date_utc).getTime() > now,
      )
      .sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));

    return upcoming[0] || null;
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

  function setSearchType(type) {
    searchType.value = type;
  }

  function setStatusFilter(filters) {
    statusFilter.value = filters;
  }

  function setYear(year) {
    yearFilter.value = year;
  }

  function setFavoritesOnly(value) {
    favoritesOnly.value = value;
  }

  return {
    launches,
    launchById,
    loading,
    error,
    search,
    searchType,
    statusFilter,
    yearFilter,
    favoritesOnly,
    availableYears,
    filteredLaunches,
    nextLaunch,
    fetchLaunches,
    fetchLaunch,
    setSearch,
    setSearchType,
    setStatusFilter,
    setYear,
    setFavoritesOnly,
  };
});
