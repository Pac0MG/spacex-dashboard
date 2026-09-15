<template>
  <div class="launch-filter">
    <h2>Filter Launches</h2>
    <div class="filter-row">
      <span class="filter-option">
        <input
          type="checkbox"
          id="success"
          :checked="filters.success"
          @change="updateStatusFilter"
        />
        <label for="success">Success</label>
      </span>
      <span class="filter-option">
        <input
          type="checkbox"
          id="failure"
          :checked="filters.failure"
          @change="updateStatusFilter"
        />
        <label for="failure">Failure</label>
      </span>
      <span class="filter-option">
        <input
          type="checkbox"
          id="upcoming"
          :checked="filters.upcoming"
          @change="updateStatusFilter"
        />
        <label for="upcoming">Upcoming</label>
      </span>
      <span class="filter-option">
        <input
          type="checkbox"
          id="favoritesOnly"
          :checked="favoritesOnly"
          @change="updateFavoritesOnly"
        />
        <label for="favoritesOnly">Favorites only ★</label>
      </span>
    </div>
    <div class="year-row">
      <label for="year-select">Year</label>
      <select id="year-select" :value="selectedYear" @change="updateYear">
        <option value="all">All Years</option>
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({ success: true, failure: true, upcoming: true }),
  },
  years: {
    type: Array,
    default: () => [],
  },
  selectedYear: {
    type: [String, Number],
    default: "all",
  },
  favoritesOnly: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "change-filter",
  "change-year",
  "change-favorites-only",
]);
function updateStatusFilter(event) {
  const inputId = event.target.id;
  const isActive = event.target.checked;

  emit("change-filter", { ...props.filters, [inputId]: isActive });
}
function updateYear(event) {
  emit("change-year", event.target.value);
}
function updateFavoritesOnly(event) {
  emit("change-favorites-only", event.target.checked);
}
</script>

<style scoped>
.launch-filter {
  padding: 20px;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin-bottom: 20px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 20px;
}

.launch-filter h2 {
  margin: 0;
  font-size: 18px;
  flex-basis: 100%;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.year-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.year-row select {
  padding: 8px 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text);
}

@media (max-width: 700px) {
  .launch-filter {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
