<template>
  <AuthCard title="New password" subtitle="Choose a new password for your account.">
    <div v-if="!token" class="auth-form">
      <p class="auth-error" role="alert">
        This reset link is incomplete. Request a new one.
      </p>
    </div>

    <form v-else class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field" :class="{ 'has-error': fieldError }">
        <label for="password">New password</label>
        <PasswordInput
          id="password"
          v-model="password"
          autocomplete="new-password"
          minlength="8"
          autofocus
          required
        />
        <span v-if="fieldError" class="auth-field-error">{{ fieldError }}</span>
        <span v-else class="auth-field-hint">At least 8 characters.</span>
      </div>

      <div class="auth-field" :class="{ 'has-error': confirmError }">
        <label for="confirm">Confirm new password</label>
        <PasswordInput
          id="confirm"
          v-model="confirm"
          autocomplete="new-password"
          required
        />
        <span v-if="confirmError" class="auth-field-error">
          {{ confirmError }}
        </span>
      </div>

      <button type="submit" class="auth-submit" :disabled="loading">
        {{ loading ? "Saving..." : "Change password" }}
      </button>
    </form>

    <template #footer>
      <RouterLink :to="{ name: 'forgot-password' }">
        Request a new link
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthCard from "../components/AuthCard.vue";
import PasswordInput from "../components/PasswordInput.vue";
import { resetPasswordRequest } from "../services/auth";

const route = useRoute();
const router = useRouter();

const token = computed(() =>
  typeof route.query.token === "string" ? route.query.token : "",
);

const password = ref("");
const confirm = ref("");
const error = ref("");
const fieldError = ref("");
const confirmError = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  fieldError.value = "";
  confirmError.value = "";

  if (password.value.length < 8) {
    fieldError.value = "Password must be at least 8 characters.";
    return;
  }
  if (password.value !== confirm.value) {
    confirmError.value = "The passwords don't match.";
    return;
  }

  loading.value = true;
  try {
    await resetPasswordRequest(token.value, password.value);
    router.replace({ name: "login", query: { reset: "1" } });
  } catch (err) {
    fieldError.value = err.fieldErrors?.password || "";
    if (!fieldError.value) error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
