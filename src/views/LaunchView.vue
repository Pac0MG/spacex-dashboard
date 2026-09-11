<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Launches</h1>
        <p>Explore launches from SpaceX.</p>
      </div>

      <input
        v-model="store.search"
        type="search"
        placeholder="Search launches..."
        class="search-input"
      />
    </div>

    <LaunchFilter
      :years="store.availableYears"
      :selected-year="store.yearFilter"
      @change-filter="handleFilterChange"
      @change-year="handleYearChange"
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
      message="Try a new name"
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

const store = useLaunchesStore();

const currentPage = ref(1);
const launchesPerPage = 20;

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
  (value) => {
    // console.log("SEARCH:", value);
    currentPage.value = 1;
  },
);

watch(
  () => store.launches,
  (value) => {
    // console.log("=== LAUNCHES UPDATED ===");
    // console.log("STORE LAUNCHES:", value);
    // console.log("FILTERED LAUNCHES:", store.filteredLaunches);
    // console.log("VISIBLE LAUNCHES:", visibleLaunches.value);
    // console.log("LOADING:", store.loading);
    // console.log("ERROR:", store.error);
  },
  { deep: true },
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
  color: #666;
}

.search-input {
  width: 300px;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
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
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }
}
</style>
