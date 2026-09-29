<template>
  <AuthCard
    title="Sign up"
    subtitle="Create an account to explore SpaceX launches."
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field" :class="{ 'has-error': fieldErrors.name }">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          autofocus
          required
        />
        <span v-if="fieldErrors.name" class="auth-field-error">
          {{ fieldErrors.name }}
        </span>
      </div>

      <div class="auth-field" :class="{ 'has-error': fieldErrors.username }">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          required
        />
        <span v-if="fieldErrors.username" class="auth-field-error">
          {{ fieldErrors.username }}
        </span>
      </div>

      <div class="auth-field" :class="{ 'has-error': fieldErrors.email }">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
        />
        <span v-if="fieldErrors.email" class="auth-field-error">
          {{ fieldErrors.email }}
        </span>
      </div>

      <button type="submit" class="auth-submit" :disabled="loading">
        {{ loading ? "Creating account..." : "Sign up" }}
      </button>
    </form>

    <template #footer>
      Already have an account?
      <RouterLink :to="{ name: 'login', query: route.query }">
        Log in
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthCard from "../components/AuthCard.vue";
import { useAuthStore } from "../store/auth";
import { safeRedirect } from "../router/redirect";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const form = reactive({ name: "", username: "", email: "" });
const fieldErrors = ref({});
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  fieldErrors.value = {};

  loading.value = true;
  try {
    await auth.signup({
      name: form.name,
      username: form.username,
      email: form.email,
    });
    router.replace(safeRedirect(route.query.redirect));
  } catch (err) {
    fieldErrors.value = err.fieldErrors || {};
    // Field messages already explain validation problems; only show the
    // banner for errors that aren't tied to a field.
    if (!Object.keys(fieldErrors.value).length) error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
