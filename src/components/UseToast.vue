<template>
  <div class="toast-stack">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <span class="toast-icon" aria-hidden="true">
          {{ toast.type === "error" ? "⚠" : "ℹ" }}
        </span>

        <p class="toast-message">{{ toast.message }}</p>

        <button
          type="button"
          class="toast-close"
          aria-label="Dismiss notification"
          @click="toastStore.dismiss(toast.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from "../store/toast";

const toastStore = useToastStore();
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-status-failure-text);
  box-shadow: 0 4px 16px var(--color-toast-shadow);
}

.toast-icon {
  font-size: 16px;
  color: var(--color-status-failure-text);
  line-height: 1.4;
}

.toast-message {
  flex: 1;
  margin: 0;
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.4;
}

.toast-close {
  border: none;
  background: none;
  font-size: 18px;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
}

.toast-close:hover {
  color: var(--color-text);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

@media (max-width: 600px) {
  .toast-stack {
    top: 16px;
    left: 16px;
    right: 16px;
    transform: none;
    width: auto;
    max-width: none;
  }
}
</style>
