<template>
  <div class="error-message">
    <h2>Upss, something went wrong!</h2>

    <p>{{ message }}</p>

    <button @click="$emit('retry')">Try again later, please!</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
});

defineEmits(["retry"]);
</script>

<style scoped>
.error-message {
  padding: 30px;
  text-align: center;
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.error-message h2 {
  margin-top: 0;
}

.error-message p {
  color: #666;
}

.error-message button {
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.error-message button:hover {
  background: #1d4ed8;
}
</style>
