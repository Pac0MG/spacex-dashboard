import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "spacex-dashboard:theme";

function loadIsDark() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch (err) {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(loadIsDark());

  function applyToDocument() {
    document.documentElement.classList.toggle("dark", isDark.value);
  }
  applyToDocument();

  watch(isDark, (value) => {
    applyToDocument();

    try {
      localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
    } catch (err) {}
  });

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return {
    isDark,
    toggleTheme,
  };
});
