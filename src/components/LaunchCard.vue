<template>
  <article class="launch-card">
    <div class="launch-image">
      <img
        v-if="launch.links?.patch?.small"
        :src="launch.links.patch.small"
        :alt="`Mission patch for ${launch.name}`"
      />
      <div v-else class="no-image">No image</div>

      <button
        type="button"
        class="favorite-btn"
        :class="{ active: isFavorite }"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        @click="toggleFavorite"
      >
        {{ isFavorite ? "★" : "☆" }}
      </button>
    </div>
    <div class="launch-content">
      <h2>{{ launch.name }}</h2>
      <p class="launch-date">
        {{ formattedDate }}
      </p>
      <span class="status" :class="statusClass">
        {{ statusLabel }}
      </span>
      <p v-if="launch.details" class="details">
        {{ launch.details }}
      </p>
      <RouterLink class="details-link" :to="`/launches/${launch.id}`">
        View details
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useFavoritesStore } from "../store/favorites";

const props = defineProps({
  launch: {
    type: Object,
    required: true,
  },
});

const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.launch.id));

function toggleFavorite() {
  favoritesStore.toggleFavorite(props.launch.id);
}

const formattedDate = computed(() => {
  return new Date(props.launch.date_utc).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const statusLabel = computed(() => {
  if (props.launch.upcoming) return "Upcoming";
  return props.launch.success ? "Success" : "Failure";
});

const statusClass = computed(() => {
  if (props.launch.upcoming) return "upcoming";
  return props.launch.success ? "success" : "failure";
});
</script>

<style scoped>
.launch-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.launch-image {
  position: relative;
  width: 120px;
  min-width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.favorite-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  color: #9ca3af;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.favorite-btn:hover {
  background: white;
}

.favorite-btn.active {
  color: #f59e0b;
}

.launch-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.launch-image:hover img {
  transform: scale(1.25);
}

.no-image {
  font-size: 14px;
  color: #777;
  text-align: center;
}

.launch-content {
  flex: 1;
}

.launch-content h2 {
  margin-top: 0;
  margin-bottom: 8px;
}

.launch-date {
  margin: 0 0 10px;
  color: #666;
}

.status {
  display: inline-block;
  padding: 5px 10px;
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

.details {
  line-height: 1.5;
}

.details-link {
  display: inline-block;
  margin-top: 10px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

.details-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .launch-card {
    flex-direction: column;
  }

  .launch-image {
    width: 100%;
    height: 160px;
  }
}
</style>
