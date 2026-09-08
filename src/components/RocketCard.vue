<template>
  <article class="rocket-card">
    <div class="rocket-image">
      <img
        v-if="rocket.flickr_images?.[0]"
        :src="rocket.flickr_images[0]"
        :alt="`Photo of ${rocket.name}`"
      />
      <div v-else class="no-image">No image</div>
    </div>
    <div class="rocket-content">
      <div class="rocket-title">
        <h2>{{ rocket.name }}</h2>
        <span class="status" :class="rocket.active ? 'active' : 'retired'">
          {{ rocket.active ? "Active" : "Retired" }}
        </span>
      </div>

      <p v-if="rocket.description" class="description">
        {{ rocket.description }}
      </p>

      <dl class="specs">
        <div class="spec">
          <dt>First flight</dt>
          <dd>{{ formattedFirstFlight }}</dd>
        </div>
        <div class="spec">
          <dt>Height</dt>
          <dd>{{ rocket.height?.meters }} m</dd>
        </div>
        <div class="spec">
          <dt>Diameter</dt>
          <dd>{{ rocket.diameter?.meters }} m</dd>
        </div>
        <div class="spec">
          <dt>Success rate</dt>
          <dd>{{ rocket.success_rate_pct }}%</dd>
        </div>
        <div class="spec">
          <dt>Cost per launch</dt>
          <dd>{{ formattedCost }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  rocket: {
    type: Object,
    required: true,
  },
});

const formattedFirstFlight = computed(() => {
  if (!props.rocket.first_flight) return "—";
  return new Date(props.rocket.first_flight).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const formattedCost = computed(() => {
  if (!props.rocket.cost_per_launch) return "—";
  return `$${props.rocket.cost_per_launch.toLocaleString("en-US")}`;
});
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
  overflow: hidden;
}

.rocket-image {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  overflow: hidden;
}

.rocket-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 14px;
  color: #777;
  text-align: center;
}

.rocket-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.rocket-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.rocket-title h2 {
  margin: 0;
}

.status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

.active {
  background: #dcfce7;
  color: #166534;
}

.retired {
  background: #f3f4f6;
  color: #4b5563;
}

.description {
  color: #444;
  line-height: 1.5;
  margin-bottom: 16px;
}

.specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
}

.spec:last-child {
  grid-column: 1 / -1;
}

.spec dt {
  font-size: 12px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.spec dd {
  margin: 2px 0 0;
  font-weight: bold;
}

@media (max-width: 600px) {
  .specs {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
