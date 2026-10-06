<template>
  <AuthCard
    title="Sign up"
    subtitle="Create an account to explore SpaceX launches."
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <AvatarPicker v-model="form.avatar" />
      <span v-if="fieldErrors.avatar" class="auth-field-error">
        {{ fieldErrors.avatar }}
      </span>

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

      <div class="auth-field" :class="{ 'has-error': fieldErrors.password }">
        <label for="password">Password</label>
        <PasswordInput
          id="password"
          v-model="form.password"
          autocomplete="new-password"
          minlength="9"
          required
        />
        <span v-if="fieldErrors.password" class="auth-field-error">
          {{ fieldErrors.password }}
        </span>
        <PasswordRequirements v-if="form.password" :password="form.password" />
        <span v-else class="auth-field-hint">
          At least 9 characters, 1 uppercase letter and 1 special character.
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
import AuthCard from "../../components/auth/AuthCard.vue";
import AvatarPicker from "../../components/user/AvatarPicker.vue";
import PasswordInput from "../../components/auth/PasswordInput.vue";
import PasswordRequirements from "../../components/auth/PasswordRequirements.vue";
import { useAuthStore } from "../../store/auth/auth";
import { meetsPasswordRules } from "../../utils/passwordRules";
import { safeRedirect } from "../../router/redirect";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  avatar: null,
});
const fieldErrors = ref({});
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  fieldErrors.value = {};

  if (!meetsPasswordRules(form.password)) {
    fieldErrors.value = { password: "The password doesn't meet all the requirements." };
    return;
  }

  loading.value = true;
  try {
    await auth.signup({ ...form });
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
