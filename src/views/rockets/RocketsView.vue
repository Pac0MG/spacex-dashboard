<template>
  <section>
    <div class="page-header">
      <h1>{{ t("rockets.title") }}</h1>
      <p>{{ t("rockets.subtitle") }}</p>
    </div>
    <LoadingSkeleton v-if="store.loading" variant="vertical" :count="6" />
    <ErrorMessage
      v-else-if="store.error"
      :message="t(store.error)"
      @retry="loadRockets"
    />
    <EmptyState
      v-else-if="store.rockets.length === 0"
      :title="t('rockets.emptyTitle')"
      :message="t('rockets.emptyMessage')"
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
import { useI18n } from "vue-i18n";
import { useRocketsStore } from "../../store/rockets/rockets";
import RocketCard from "../../components/rockets/RocketCard.vue";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.vue";
import ErrorMessage from "../../components/common/ErrorMessage.vue";
import EmptyState from "../../components/common/EmptyState.vue";
const { t } = useI18n();
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
  color: var(--color-text-muted);
}
.rockets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
</style>
