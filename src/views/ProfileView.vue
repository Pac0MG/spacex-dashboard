<template>
  <div class="profile-page">
    <template v-if="user">
      <section class="auth-card profile-card">
        <AvatarPicker
          v-model="avatar"
          :disabled="savingPhoto"
          hint="Click to add a photo"
        />
        <p v-if="photoError" class="auth-field-error" role="alert">
          {{ photoError }}
        </p>

        <h1>{{ user.name }}</h1>
        <p class="profile-username">@{{ user.username }}</p>

        <dl class="profile-details">
          <div>
            <dt>Name</dt>
            <dd>{{ user.name }}</dd>
          </div>
          <div>
            <dt>Username</dt>
            <dd>{{ user.username }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ user.email }}</dd>
          </div>
        </dl>

        <div class="profile-danger">
          <button
            v-if="!confirmingDelete"
            type="button"
            class="profile-delete"
            @click="confirmingDelete = true"
          >
            Delete account
          </button>

          <form v-else class="auth-form" novalidate @submit.prevent="deleteAccount">
            <p class="profile-danger-text">
              This permanently deletes your account. It can't be undone. Enter
              your password to confirm.
            </p>

            <p v-if="deleteError" class="auth-error" role="alert">
              {{ deleteError }}
            </p>

            <div class="auth-field">
              <label for="delete-password">Password</label>
              <input
                id="delete-password"
                v-model="deletePassword"
                type="password"
                autocomplete="current-password"
                autofocus
                required
              />
            </div>

            <div class="profile-danger-actions">
              <button
                type="button"
                class="profile-cancel"
                :disabled="deleting"
                @click="cancelDelete"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="profile-delete profile-delete-confirm"
                :disabled="deleting"
              >
                {{ deleting ? "Deleting..." : "Delete my account" }}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="profile-favorites">
        <h2>
          Favorite launches
          <span v-if="!launches.loading && !launches.error" class="count">
            {{ favoriteLaunches.length }}
          </span>
        </h2>

        <LoadingSkeleton v-if="launches.loading" :count="2" />

        <ErrorMessage
          v-else-if="launches.error"
          :message="launches.error"
          @retry="launches.fetchLaunches"
        />

        <EmptyState
          v-else-if="favoriteLaunches.length === 0"
          title="No favorite launches yet"
          message="Tap the star on a launch to save it here."
        />

        <div v-else class="favorites-grid">
          <LaunchCard
            v-for="launch in favoriteLaunches"
            :key="launch.id"
            :launch="launch"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AvatarPicker from "../components/AvatarPicker.vue";
import EmptyState from "../components/EmptyState.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import LaunchCard from "../components/LaunchCard.vue";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import { useAuthStore } from "../store/auth";
import { useFavoritesStore } from "../store/favorites";
import { useLaunchesStore } from "../store/launches";
import { useToastStore } from "../store/toast";

const router = useRouter();
const auth = useAuthStore();
const favorites = useFavoritesStore();
const launches = useLaunchesStore();
const toast = useToastStore();

// The route requires a session, but the user goes null for a moment once the
// account is deleted, before the redirect lands. The template guards on it.
const user = computed(() => auth.user);

const savingPhoto = ref(false);
const photoError = ref("");

// Picking a photo saves it right away; clearing it removes it.
const avatar = computed({
  get: () => user.value?.avatar ?? null,
  async set(value) {
    photoError.value = "";
    savingPhoto.value = true;
    try {
      await auth.updateAvatar(value);
    } catch (err) {
      photoError.value = err.message;
    } finally {
      savingPhoto.value = false;
    }
  },
});

const favoriteLaunches = computed(() =>
  launches.launches
    .filter((launch) => favorites.isFavorite(launch.id))
    .sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc)),
);

const confirmingDelete = ref(false);
const deletePassword = ref("");
const deleteError = ref("");
const deleting = ref(false);

function cancelDelete() {
  confirmingDelete.value = false;
  deletePassword.value = "";
  deleteError.value = "";
}

async function deleteAccount() {
  deleteError.value = "";

  if (!deletePassword.value) {
    deleteError.value = "Enter your password to confirm.";
    return;
  }

  const userId = user.value.id;
  deleting.value = true;
  try {
    await auth.deleteAccount(deletePassword.value);
    favorites.forgetUser(userId);
    toast.show("Your account has been deleted.", "info");
    router.replace({ name: "login" });
  } catch (err) {
    deleteError.value = err.message;
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  launches.fetchLaunches();
});
</script>

<style>
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-card h1 {
  margin-top: 20px;
  overflow-wrap: anywhere;
}

.profile-username {
  margin: 0 0 28px;
  color: var(--color-text-muted);
}

.profile-details {
  width: 100%;
  margin: 0;
  text-align: left;
  border-top: 1px solid var(--color-border);
}

.profile-details > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.profile-details dt {
  font-size: 14px;
  font-weight: bold;
}

.profile-details dd {
  margin: 0;
  color: var(--color-text-muted);
  overflow-wrap: anywhere;
  text-align: right;
}

.profile-danger {
  width: 100%;
  margin-top: 28px;
  text-align: left;
}

.profile-danger-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.profile-danger-actions {
  display: flex;
  gap: 12px;
}

.profile-danger-actions > button {
  flex: 1;
}

.profile-delete,
.profile-cancel {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.profile-delete {
  width: 100%;
  border: 1px solid var(--color-status-failure-text);
  background: transparent;
  color: var(--color-status-failure-text);
}

.profile-delete:hover:not(:disabled) {
  background: var(--color-status-failure-bg);
}

.profile-delete-confirm {
  background: var(--color-status-failure-text);
  color: var(--color-status-failure-bg);
}

.profile-delete-confirm:hover:not(:disabled) {
  background: var(--color-status-failure-text);
  opacity: 0.9;
}

.profile-cancel {
  border: 1px solid var(--color-border-strong);
  background: transparent;
  color: var(--color-text);
}

.profile-cancel:hover:not(:disabled) {
  background: var(--color-subtle-bg);
}

.profile-delete:disabled,
.profile-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-favorites {
  margin-top: 40px;
}

.profile-favorites h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
}

.profile-favorites .count {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 14px;
  background: var(--color-favorite-active-bg);
  color: var(--color-favorite-active-text);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 440px), 1fr));
  gap: 20px;
}
</style>
