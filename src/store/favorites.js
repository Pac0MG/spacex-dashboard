import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth";

const STORAGE_PREFIX = "spacex-dashboard:favorite-launches:";

function storageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadFavorites(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (err) {
    return new Set();
  }
}

// Favorites are kept per account, so people sharing a browser don't see each
// other's stars.
export const useFavoritesStore = defineStore("favorites", () => {
  const auth = useAuthStore();
  const favoriteIds = ref(new Set());

  // Swap in the right set whenever someone logs in, out, or changes.
  watch(
    () => auth.user?.id,
    (userId) => {
      favoriteIds.value = userId ? loadFavorites(userId) : new Set();
    },
    { immediate: true },
  );

  watch(
    favoriteIds,
    (ids) => {
      const userId = auth.user?.id;
      if (!userId) return;
      try {
        localStorage.setItem(storageKey(userId), JSON.stringify([...ids]));
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

  // Drops a deleted account's saved favorites.
  function forgetUser(userId) {
    try {
      localStorage.removeItem(storageKey(userId));
    } catch (err) {}
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    forgetUser,
  };
});
