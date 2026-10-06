<template>
  <AuthCard
    title="Forgot password"
    subtitle="Enter your account email and we'll send you a link to choose a new password."
  >
    <p v-if="sent" class="auth-success" role="status">
      If an account exists for {{ email }}, a reset link is on its way. It's
      valid for 1 hour.
    </p>

    <form v-else class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          autofocus
          required
        />
      </div>

      <button type="submit" class="auth-submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send reset link" }}
      </button>
    </form>

    <template #footer>
      <RouterLink :to="{ name: 'login', query: route.query }">
        Back to log in
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import AuthCard from "../../components/auth/AuthCard.vue";
import { forgotPasswordRequest } from "../../services/auth";

const route = useRoute();

const email = ref("");
const error = ref("");
const loading = ref(false);
const sent = ref(false);

async function submit() {
  error.value = "";

  if (!email.value.trim()) {
    error.value = "Enter your email address.";
    return;
  }

  loading.value = true;
  try {
    await forgotPasswordRequest(email.value.trim());
    sent.value = true;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
