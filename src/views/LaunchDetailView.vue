<template>
  <section>
    <RouterLink to="/launches" class="back-link">
      ← Back to Launches
    </RouterLink>

    <LoadingSkeleton v-if="launchesStore.loading || rocketsStore.loading" />

    <ErrorMessage
      v-else-if="launchesStore.error || rocketsStore.error"
      :message="launchesStore.error || rocketsStore.error"
      @retry="loadLaunchDetails"
    />

    <EmptyState
      v-else-if="!launch"
      title="Launch not found"
      message="This launch could not be found."
    />

    <article v-else class="detail-page">
      <div class="detail-image">
        <img
          v-if="launch.links?.patch?.large"
          :src="launch.links.patch.large"
          :alt="`Mission patch for ${launch.name}`"
        />
        <div v-else class="no-image">No image</div>
      </div>

      <header class="detail-header">
        <h1>{{ launch.name }}</h1>

        <div class="detail-header-badges">
          <span class="status" :class="statusClass">
            {{ statusLabel }}
          </span>

          <button
            type="button"
            class="favorite-btn"
            :class="{ active: isFavorite }"
            :aria-label="
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            "
            @click="toggleFavorite"
          >
            {{ isFavorite ? "★ Favorited" : "☆ Add to favorites" }}
          </button>
        </div>
      </header>

      <p class="date">
        {{ formattedDate }}
      </p>

      <div class="detail-section">
        <h2>Description</h2>

        <p>
          {{ launch.details || "No description available." }}
        </p>
      </div>

      <div class="detail-section">
        <h2>Rocket</h2>

        <div v-if="rocket" class="rocket-info">
          <strong>{{ rocket.name }}</strong>

          <span>
            State:
            {{ rocket.active ? "Active" : "Inactive" }}
          </span>
        </div>

        <p v-else>Rocket information not available.</p>
      </div>

      <div class="detail-section">
        <h2>Links</h2>

        <div class="links">
          <a
            v-if="launch.links?.webcast"
            :href="launch.links.webcast"
            target="_blank"
            rel="noopener noreferrer"
          >
            Webcast
          </a>

          <a
            v-if="launch.links?.article"
            :href="launch.links.article"
            target="_blank"
            rel="noopener noreferrer"
          >
            Article
          </a>

          <a
            v-if="launch.links?.wikipedia"
            :href="launch.links.wikipedia"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikipedia
          </a>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useLaunchesStore } from "../store/launches";
import { useRocketsStore } from "../store/rockets";
import { useFavoritesStore } from "../store/favorites";

import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import EmptyState from "../components/EmptyState.vue";

const route = useRoute();

const launchesStore = useLaunchesStore();
const rocketsStore = useRocketsStore();
const favoritesStore = useFavoritesStore();

const launch = computed(() => {
  return launchesStore.launchById.get(route.params.id);
});

const rocket = computed(() => {
  if (!launch.value?.rocket) {
    return null;
  }

  return rocketsStore.rocketById.get(launch.value.rocket);
});

const formattedDate = computed(() => {
  if (!launch.value?.date_utc) {
    return "";
  }

  return new Date(launch.value.date_utc).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});
const statusLabel = computed(() => {
  if (!launch.value) return "";
  if (launch.value.upcoming) return "Upcoming";
  return launch.value.success ? "Success" : "Failure";
});

const statusClass = computed(() => {
  if (!launch.value) return "";
  if (launch.value.upcoming) return "upcoming";
  return launch.value.success ? "success" : "failure";
});

const isFavorite = computed(() => {
  if (!launch.value) return false;
  return favoritesStore.isFavorite(launch.value.id);
});

function toggleFavorite() {
  if (!launch.value) return;
  favoritesStore.toggleFavorite(launch.value.id);
}

async function loadLaunchDetails() {
  try {
    const loadedLaunch = await launchesStore.fetchLaunch(route.params.id);

    if (loadedLaunch?.rocket) {
      await rocketsStore.fetchRocket(loadedLaunch.rocket);
    }
  } catch (error) {}
}

onMounted(() => {
  loadLaunchDetails();
});
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: #2563eb;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-page {
  background: white;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.detail-image {
  width: 100%;
  height: 280px;
  margin-bottom: 25px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image .no-image {
  font-size: 14px;
  color: #777;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.detail-header h1 {
  margin: 0;
}

.detail-header-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.favorite-btn:hover {
  border-color: #f59e0b;
}

.favorite-btn.active {
  border-color: #f59e0b;
  color: #b45309;
  background: #fffbeb;
}

.date {
  color: #666;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.failure {
  background: #fee2e2;
  color: #991b1b;
}

.upcoming {
  background: #dbeafe;
  color: #1e40af;
}

.detail-section {
  margin-top: 30px;
}

.detail-section h2 {
  margin-bottom: 10px;
}

.detail-section p {
  line-height: 1.6;
}

.rocket-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 8px;
}

.links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.links a {
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

.links a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-image {
    height: 180px;
  }
}
</style>
