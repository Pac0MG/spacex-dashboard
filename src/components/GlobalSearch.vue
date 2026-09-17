<template>
  <button
    type="button"
    class="search-trigger"
    aria-label="Open search (Ctrl+K)"
    @click="open"
  >
    <svg
      class="search-trigger-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>

    <span class="search-trigger-label">Search</span>
    <span class="search-trigger-kbd">{{ shortcutLabel }}</span>
  </button>

  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="search-overlay" @click.self="close">
        <div
          class="search-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <div class="search-input-row">
            <svg
              class="search-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              ref="inputEl"
              v-model="query"
              type="text"
              class="search-input"
              placeholder="Search missions or rockets..."
              @keydown="onKeydown"
            />

            <button type="button" class="search-close" @click="close">
              Esc
            </button>
          </div>

          <div v-if="query.trim()" class="search-results">
            <template v-if="results.length">
              <div v-if="matchedLaunches.length" class="search-section">
                <p class="search-section-label">Missions</p>

                <button
                  v-for="(launch, i) in matchedLaunches"
                  :key="launch.id"
                  type="button"
                  class="search-result"
                  :class="{ active: activeIndex === indexOf('launch', i) }"
                  @mouseenter="activeIndex = indexOf('launch', i)"
                  @click="select({ type: 'launch', item: launch })"
                >
                  <span class="result-main">
                    <span class="result-name">{{ launch.name }}</span>
                    <span class="result-meta">{{ launchYear(launch) }}</span>
                  </span>

                  <span class="result-status" :class="statusClass(launch)">
                    {{ statusLabel(launch) }}
                  </span>
                </button>
              </div>

              <div v-if="matchedRockets.length" class="search-section">
                <p class="search-section-label">Rockets</p>

                <button
                  v-for="(rocket, i) in matchedRockets"
                  :key="rocket.id"
                  type="button"
                  class="search-result"
                  :class="{ active: activeIndex === indexOf('rocket', i) }"
                  @mouseenter="activeIndex = indexOf('rocket', i)"
                  @click="select({ type: 'rocket', item: rocket })"
                >
                  <span class="result-main">
                    <span class="result-name">{{ rocket.name }}</span>
                    <span class="result-meta">Rocket</span>
                  </span>
                </button>
              </div>
            </template>

            <p v-else class="search-empty">No results for "{{ query }}"</p>
          </div>

          <p v-else class="search-hint">
            Type to search missions and rockets. Use ↑ ↓ to navigate, Enter to
            open, Esc to close.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLaunchesStore } from "../store/launches";
import { useRocketsStore } from "../store/rockets";

const router = useRouter();
const launchesStore = useLaunchesStore();
const rocketsStore = useRocketsStore();

const isOpen = ref(false);
const query = ref("");
const activeIndex = ref(0);
const inputEl = ref(null);

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

const matchedLaunches = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) {
    return [];
  }
  return launchesStore.launches
    .filter((launch) => (launch.name || "").toLowerCase().includes(term))
    .slice(0, 6);
});

const matchedRockets = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) {
    return [];
  }
  return rocketsStore.rockets
    .filter((rocket) => (rocket.name || "").toLowerCase().includes(term))
    .slice(0, 5);
});

const results = computed(() => [
  ...matchedLaunches.value.map((item) => ({ type: "launch", item })),
  ...matchedRockets.value.map((item) => ({ type: "rocket", item })),
]);

watch(query, () => {
  activeIndex.value = 0;
});

function indexOf(type, i) {
  return type === "launch" ? i : matchedLaunches.value.length + i;
}

function launchYear(launch) {
  return new Date(launch.date_utc).getFullYear();
}

function statusClass(launch) {
  if (launch.upcoming) {
    return "upcoming";
  }
  return launch.success ? "success" : "failure";
}

function statusLabel(launch) {
  if (launch.upcoming) {
    return "Upcoming";
  }
  return launch.success ? "Success" : "Failure";
}

function open() {
  isOpen.value = true;
  query.value = "";
  activeIndex.value = 0;

  launchesStore.fetchLaunches();
  rocketsStore.fetchRockets();

  nextTick(() => inputEl.value?.focus());
}

function close() {
  isOpen.value = false;
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

function select(result) {
  if (result.type === "launch") {
    router.push(`/launches/${result.item.id}`);
  } else {
    router.push("/rockets");
  }
  close();
}

function onKeydown(event) {
  if (event.key === "Escape") {
    close();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (results.value.length) {
      activeIndex.value = (activeIndex.value + 1) % results.value.length;
    }
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (results.value.length) {
      activeIndex.value =
        (activeIndex.value - 1 + results.value.length) % results.value.length;
    }
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const result = results.value[activeIndex.value];
    if (result) {
      select(result);
    }
  }
}

function onGlobalKeydown(event) {
  const isShortcut =
    (event.key === "k" || event.key === "K") &&
    (event.metaKey || event.ctrlKey);

  if (isShortcut) {
    event.preventDefault();
    toggle();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
});
</script>

<style scoped>
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-header-search-bg);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-header-text);
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: background-color 0.2s;
}

.search-trigger:hover {
  background: var(--color-header-search-bg-hover);
}

.search-trigger-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.search-trigger-label {
  opacity: 0.85;
}

.search-trigger-kbd {
  font-size: 11px;
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-header-search-kbd-bg);
  opacity: 0.85;
}

.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: var(--color-overlay-bg);
  display: flex;
  justify-content: center;
  padding-top: 12vh;
}

.search-panel {
  width: 100%;
  max-width: 640px;
  max-height: 70vh;
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 20px 60px var(--color-toast-shadow);
  overflow: hidden;
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.search-input-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  color: var(--color-text);
}

.search-input::placeholder {
  color: var(--color-text-faint);
}

.search-close {
  border: none;
  background: var(--color-subtle-bg);
  color: var(--color-text-muted);
  font-size: 12px;
  font-family: monospace;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-results {
  overflow-y: auto;
  padding: 8px;
}

.search-section + .search-section {
  margin-top: 8px;
}

.search-section-label {
  margin: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.search-result {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: var(--color-text);
}

.search-result:hover,
.search-result.active {
  background: var(--color-subtle-bg);
}

.result-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.result-status {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.result-status.success {
  background: var(--color-status-success-bg);
  color: var(--color-status-success-text);
}

.result-status.failure {
  background: var(--color-status-failure-bg);
  color: var(--color-status-failure-text);
}

.result-status.upcoming {
  background: var(--color-status-upcoming-bg);
  color: var(--color-status-upcoming-text);
}

.search-empty,
.search-hint {
  padding: 24px 18px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .search-trigger-label {
    display: none;
  }

  .search-overlay {
    padding-top: 8vh;
  }
}
</style>
