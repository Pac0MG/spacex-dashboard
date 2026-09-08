<template>
  <section>
    <div class="page-header">
      <h1>Rockets</h1>
      <p>
        Explore rockets from SpaceX.
      </p>
    </div>
    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage
      v-else-if="store.error"
      :message="store.error"
      @retry="loadRockets"
    />
    <EmptyState
      v-else-if="store.rockets.length === 0"
      title="No rockets found"
      message="There are no rockets to present."
    />
    <div v-else class="rockets-grid">
      <RocketCard
        v-for="rocket in store.rockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
  </section>
</template>
<script setup>
import { onMounted } from "vue";
import { useRocketsStore } from "../store/rockets";
import RocketCard from "../components/RocketCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import EmptyState from "../components/EmptyState.vue";
const store = useRocketsStore();
async function loadRockets() {
  await store.fetchRockets();
}
onMounted(() => {
  loadRockets();
});
</script>
<style scoped>
.page-header {
  margin-bottom: 30px;
}
.page-header h1 {
  margin-bottom: 8px;
}
.page-header p {
  margin: 0;
  color: #666;
}
.rockets-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  );
  gap: 20px;
}
</style>
