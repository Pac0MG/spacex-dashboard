<template>
  <AuthCard
    title="Log in"
    subtitle="Use your email or username and password to continue."
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="route.query.reset" class="auth-success" role="status">
        Password changed. Log in with your new password.
      </p>
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

      <div class="auth-field">
        <label for="password">Password</label>
        <PasswordInput
          id="password"
          v-model="password"
          autocomplete="current-password"
          required
        />
        <RouterLink
          class="auth-forgot"
          :to="{ name: 'forgot-password', query: redirectQuery }"
        >
          Forgot your password?
        </RouterLink>
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
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthCard from "../../components/auth/AuthCard.vue";
import PasswordInput from "../../components/auth/PasswordInput.vue";
import { useAuthStore } from "../../store/auth/auth";
import { safeRedirect } from "../../router/redirect";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// Keep the post-login destination if the user detours through "forgot password".
const redirectQuery = computed(() =>
  route.query.redirect ? { redirect: route.query.redirect } : {},
);

const identifier = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";

  if (!identifier.value.trim() || !password.value) {
    error.value = "Enter your email or username and your password.";
    return;
  }

  loading.value = true;
  try {
    await auth.login(identifier.value.trim(), password.value);
    router.replace(safeRedirect(route.query.redirect));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
