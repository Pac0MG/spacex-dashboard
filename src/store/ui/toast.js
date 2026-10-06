import { defineStore } from "pinia";
import { ref } from "vue";

let nextId = 1;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref([]);

  function show(message, type = "error", duration = 5000) {
    const id = nextId++;

    toasts.value.push({ id, message, type });

    setTimeout(() => {
      dismiss(id);
    }, duration);
  }

  function showError(message) {
    show(message, "error");
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return { toasts, show, showError, dismiss };
});
