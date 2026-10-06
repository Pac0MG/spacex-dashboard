import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  deleteAccountRequest,
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  signupRequest,
  updateAvatarRequest,
} from "../../services/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isReady = ref(false);

  const isAuthenticated = computed(() => user.value !== null);

  let initPromise = null;

  // Restores the session from the cookie. Runs once; later calls reuse it.
  function init() {
    initPromise ??= fetchCurrentUser()
      .then((data) => {
        user.value = data.user;
      })
      .catch(() => {
        user.value = null;
      })
      .finally(() => {
        isReady.value = true;
      });
    return initPromise;
  }

  async function login(identifier, password) {
    const data = await loginRequest(identifier, password);
    user.value = data.user;
  }

  async function signup(payload) {
    const data = await signupRequest(payload);
    user.value = data.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      user.value = null;
    }
  }

  // Pass null to remove the photo.
  async function updateAvatar(avatar) {
    const data = await updateAvatarRequest(avatar);
    user.value = data.user;
  }

  async function deleteAccount(password) {
    await deleteAccountRequest(password);
    user.value = null;
  }

  return {
    user,
    isReady,
    isAuthenticated,
    init,
    login,
    signup,
    logout,
    updateAvatar,
    deleteAccount,
  };
});
