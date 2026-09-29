<template>
  <AuthCard title="Log in" subtitle="Use your email or username to continue.">
    <form class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field">
        <label for="identifier">Email or username</label>
        <input
          id="identifier"
          v-model="identifier"
          type="text"
          autocomplete="username"
          autofocus
          required
        />
      </div>

      <button type="submit" class="auth-submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Log in" }}
      </button>
    </form>

    <template #footer>
      Don't have an account?
      <RouterLink :to="{ name: 'signup', query: route.query }">
        Sign up
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthCard from "../components/AuthCard.vue";
import { useAuthStore } from "../store/auth";
import { safeRedirect } from "../router/redirect";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const identifier = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";

  if (!identifier.value.trim()) {
    error.value = "Enter your email or username.";
    return;
  }

  loading.value = true;
  try {
    await auth.login(identifier.value.trim());
    router.replace(safeRedirect(route.query.redirect));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
