<template>
  <div class="skeleton-grid" :class="variant">
    <div v-for="n in count" :key="n" class="skeleton-card">
      <div class="skeleton-image shimmer"></div>

      <div class="skeleton-content">
        <div class="skeleton-line shimmer skeleton-title"></div>
        <div class="skeleton-line shimmer skeleton-date"></div>
        <div class="skeleton-line shimmer skeleton-badge"></div>
        <div class="skeleton-line shimmer skeleton-text"></div>
        <div class="skeleton-line shimmer skeleton-text short"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 4,
  },

  variant: {
    type: String,
    default: "horizontal",
    validator: (value) => ["horizontal", "vertical"].includes(value),
  },
});
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  gap: 20px;
}

.skeleton-grid.vertical {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.skeleton-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.skeleton-grid.vertical .skeleton-card {
  flex-direction: column;
}

.skeleton-image {
  width: 120px;
  min-width: 120px;
  height: 120px;
  border-radius: 8px;
  background: var(--color-skeleton-base);
}

.skeleton-grid.vertical .skeleton-image {
  width: 100%;
  height: 180px;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: var(--color-skeleton-base);
}

.skeleton-title {
  width: 60%;
  height: 20px;
}

.skeleton-date {
  width: 35%;
}

.skeleton-badge {
  width: 80px;
  height: 22px;
  border-radius: 20px;
}

.skeleton-text {
  width: 100%;
}

.skeleton-text.short {
  width: 70%;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-shimmer),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 600px) {
  .skeleton-card {
    flex-direction: column;
  }

  .skeleton-image {
    width: 100%;
    height: 160px;
  }
}
</style>
