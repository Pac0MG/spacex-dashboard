<template>
  <div class="empty-state">
    <h2>{{ title }}</h2>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "No results found",
  },

  message: {
    type: String,
    default: "There are no results to present",
  },
});
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
