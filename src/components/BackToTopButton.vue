<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Only show the button once scrolling back up is actually useful, instead
// of cluttering the page with it from the very top.
const SHOW_AFTER_PX = 400;

const isVisible = ref(false);

function handleScroll() {
  isVisible.value = window.scrollY > SHOW_AFTER_PX;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1030;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px var(--color-toast-shadow);
  transition:
    background-color 0.2s,
    transform 0.15s;
}

.back-to-top:hover {
  background: var(--color-accent-hover);
  transform: scale(1.05);
}

.back-to-top svg {
  width: 22px;
  height: 22px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 480px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 44px;
    height: 44px;
  }
}
</style>
