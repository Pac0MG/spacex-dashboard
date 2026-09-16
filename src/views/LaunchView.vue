<template>
  <section>
    <NextLaunchHero
      v-if="!store.loading && !store.error && store.nextLaunch"
      :launch="store.nextLaunch"
    />

    <div class="page-header">
      <div>
        <h1>Launches</h1>
        <p>Explore launches from SpaceX.</p>
      </div>

      <div class="search-group">
        <select v-model="store.searchType" class="search-type-select">
          <option value="name">Name</option>
          <option value="year">Year</option>
        </select>

        <input
          v-model="store.search"
          type="search"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>
    </div>

    <LaunchFilter
      :filters="store.statusFilter"
      :years="store.availableYears"
      :selected-year="store.yearFilter"
      :favorites-only="store.favoritesOnly"
      @change-filter="handleFilterChange"
      @change-year="handleYearChange"
      @change-favorites-only="handleFavoritesOnlyChange"
    />

    <LoadingSkeleton v-if="store.loading" :count="6" />

    <ErrorMessage
      v-else-if="store.error"
      :message="store.error"
      @retry="loadLaunches"
    />

    <EmptyState
      v-else-if="store.filteredLaunches.length === 0"
      title="There are no results to present"
      :message="emptyStateMessage"
    />

    <template v-else>
      <div class="launches-grid">
        <LaunchCard
          v-for="launch in visibleLaunches"
          :key="launch.id"
          :launch="launch"
        />
      </div>

      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>

        <span> Page {{ currentPage }} of {{ totalPages }} </span>

        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

import { useLaunchesStore } from "../store/launches";

import LaunchCard from "../components/LaunchCard.vue";
import LaunchFilter from "../components/LaunchFilter.vue";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import EmptyState from "../components/EmptyState.vue";
import NextLaunchHero from "../components/NextLaunchHero.vue";

const store = useLaunchesStore();

const currentPage = ref(1);
const launchesPerPage = 8;

const searchPlaceholder = computed(() => {
  return store.searchType === "year"
    ? "Search by year..."
    : "Search by name...";
});

const emptyStateMessage = computed(() => {
  if (!store.search.trim()) return "";
  return store.searchType === "year" ? "Try a new year" : "Try a new name";
});

const totalPages = computed(() => {
  return Math.ceil(store.filteredLaunches.length / launchesPerPage);
});

const visibleLaunches = computed(() => {
  const startIndex = (currentPage.value - 1) * launchesPerPage;

  const endIndex = startIndex + launchesPerPage;

  return store.filteredLaunches.slice(startIndex, endIndex);
});

function goToPage(page) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleFilterChange(filters) {
  store.setStatusFilter(filters);
  currentPage.value = 1;
}

function handleYearChange(year) {
  store.setYear(year);
  currentPage.value = 1;
}

function handleFavoritesOnlyChange(value) {
  store.setFavoritesOnly(value);
  currentPage.value = 1;
}

async function loadLaunches() {
  // console.log("=== LOAD LAUNCHES ===");

  await store.fetchLaunches();

  // console.log("FETCH COMPLETED");
  // console.log("STORE LAUNCHES:", store.launches);
  // console.log("FILTERED LAUNCHES:", store.filteredLaunches);
  // console.log("VISIBLE LAUNCHES:", visibleLaunches.value);
  // console.log("LOADING:", store.loading);
  // console.log("ERROR:", store.error);
}

watch(
  () => store.search,
  () => {
    currentPage.value = 1;
  },
);

watch(
  () => store.searchType,
  () => {
    store.setSearch("");
    currentPage.value = 1;
  },
);

onMounted(() => {
  loadLaunches();
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 8px;
}

.page-header p {
  margin: 0;
  color: var(--color-text-muted);
}

.search-group {
  display: flex;
  gap: 10px;
}

.search-type-select {
  padding: 12px 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  font-size: 15px;
  background: var(--color-surface);
  color: var(--color-text);
}

.search-input {
  width: 300px;
  padding: 12px 14px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  font-size: 16px;
  background: var(--color-surface);
  color: var(--color-text);
}

.launches-grid {
  display: grid;
  gap: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: var(--color-border-strong);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-group {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}
</style>
