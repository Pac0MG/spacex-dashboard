<template>
  <article class="launch-card">
    <div class="launch-image">
      <img
        v-if="launch.links?.patch?.small"
        :src="launch.links.patch.small"
        :alt="`Mission patch for ${launch.name}`"
      />
      <div v-else class="no-image">No image</div>
    </div>
    <div class="launch-content">
      <h2>{{ launch.name }}</h2>
      <p class="launch-date">
        {{ formattedDate }}
      </p>
      <span class="status" :class="launch.success ? 'success' : 'failure'">
        {{ launch.success ? "Success" : "Failure" }}
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

const props = defineProps({
  launch: {
    type: Object,
    required: true,
  },
});

const formattedDate = computed(() => {
  return new Date(props.launch.date_utc).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
