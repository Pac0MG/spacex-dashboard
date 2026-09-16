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
          <dt>Mass</dt>
          <dd>{{ formattedMass }}</dd>
        </div>
        <div class="spec">
          <dt>Country</dt>
          <dd>{{ rocket.country || "—" }}</dd>
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

const formattedMass = computed(() => {
  if (!props.rocket.mass?.kg) return "—";
  return `${props.rocket.mass.kg.toLocaleString("en-US")} kg`;
});
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.rocket-image {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-subtle-bg);
  overflow: hidden;
}

.rocket-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rocket-image:hover img {
  transform: scale(1.25);
}

.no-image {
  font-size: 14px;
  color: var(--color-text-faint);
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
  background: var(--color-status-success-bg);
  color: var(--color-status-success-text);
}

.retired {
  background: var(--color-subtle-bg);
  color: var(--color-status-retired-text);
}

.description {
  color: var(--color-text-muted);
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
  color: var(--color-text-faint);
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
