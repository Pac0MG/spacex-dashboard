import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "spacex-dashboard:favorite-launches";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (err) {
    return new Set();
  }
}

export const useFavoritesStore = defineStore("favorites", () => {
  const favoriteIds = ref(loadFavorites());

  watch(
    favoriteIds,
    (ids) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
      } catch (err) {}
    },
    { deep: true },
  );

  function isFavorite(id) {
    return favoriteIds.value.has(id);
  }

  function toggleFavorite(id) {
    if (favoriteIds.value.has(id)) {
      favoriteIds.value.delete(id);
    } else {
      favoriteIds.value.add(id);
    }
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
});
