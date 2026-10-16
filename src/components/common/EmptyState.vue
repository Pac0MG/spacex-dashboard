<template>
  <div class="empty-state">
    <h2>{{ title ?? t("empty.title") }}</h2>

    <p v-if="shownMessage">{{ shownMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Left out, these fall back to translated defaults. An empty message hides it.
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },

  message: {
    type: String,
    default: undefined,
  },
});

const shownMessage = computed(() => props.message ?? t("empty.message"));
</script>

<style scoped>
.empty-state {
  padding: 50px 20px;
  text-align: center;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.empty-state h2 {
  margin-top: 0;
}

.empty-state p {
  margin-bottom: 0;
  color: var(--color-text-muted);
}
</style>
