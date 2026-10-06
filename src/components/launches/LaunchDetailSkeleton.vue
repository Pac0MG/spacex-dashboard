<template>
  <div class="detail-skeleton">
    <div class="skeleton-image shimmer"></div>

    <div class="skeleton-header">
      <div class="skeleton-line shimmer skeleton-title"></div>
      <div class="skeleton-badges">
        <div class="skeleton-line shimmer skeleton-badge"></div>
        <div class="skeleton-line shimmer skeleton-badge wide"></div>
      </div>
    </div>

    <div class="skeleton-line shimmer skeleton-date"></div>

    <div class="skeleton-section">
      <div class="skeleton-line shimmer skeleton-heading"></div>
      <div class="skeleton-line shimmer skeleton-text"></div>
      <div class="skeleton-line shimmer skeleton-text"></div>
      <div class="skeleton-line shimmer skeleton-text short"></div>
    </div>

    <div class="skeleton-section">
      <div class="skeleton-line shimmer skeleton-heading"></div>
      <div class="skeleton-block shimmer"></div>
    </div>

    <div class="skeleton-section">
      <div class="skeleton-line shimmer skeleton-heading"></div>
      <div class="skeleton-links">
        <div class="skeleton-link shimmer"></div>
        <div class="skeleton-link shimmer"></div>
        <div class="skeleton-link shimmer"></div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.detail-skeleton {
  background: var(--color-surface);
  padding: 30px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.skeleton-image {
  width: 100%;
  height: 280px;
  margin-bottom: 25px;
  border-radius: 8px;
  background: var(--color-skeleton-base);
}

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.skeleton-badges {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: var(--color-skeleton-base);
}

.skeleton-title {
  width: 45%;
  height: 30px;
}

.skeleton-badge {
  width: 90px;
  height: 30px;
  border-radius: 20px;
}

.skeleton-badge.wide {
  width: 130px;
}

.skeleton-date {
  width: 25%;
  margin-top: 16px;
}

.skeleton-section {
  margin-top: 30px;
}

.skeleton-heading {
  width: 140px;
  height: 20px;
  margin-bottom: 14px;
}

.skeleton-text {
  width: 100%;
  margin-bottom: 10px;
}

.skeleton-text.short {
  width: 60%;
  margin-bottom: 0;
}

.skeleton-block {
  height: 64px;
  border-radius: 8px;
  background: var(--color-skeleton-base);
}

.skeleton-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.skeleton-link {
  width: 90px;
  height: 18px;
  border-radius: 4px;
  background: var(--color-skeleton-base);
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
  .skeleton-image {
    height: 180px;
  }

  .skeleton-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
