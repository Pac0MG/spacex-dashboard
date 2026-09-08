<template>
  <div class="empty-state">
    <h2>{{ title }}</h2>

    <p>{{ message }}</p>
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
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.empty-state h2 {
  margin-top: 0;
}

.empty-state p {
  margin-bottom: 0;
  color: #666;
}
</style>
