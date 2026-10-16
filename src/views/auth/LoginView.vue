<template>
  <AuthCard
    :title="t('auth.login.title')"
    :subtitle="t('auth.login.subtitle')"
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="route.query.reset" class="auth-success" role="status">
        {{ t("auth.login.resetDone") }}
      </p>
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field">
        <label for="identifier">{{ t("auth.login.identifier") }}</label>
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
        <label for="password">{{ t("auth.fields.password") }}</label>
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
          {{ t("auth.login.forgot") }}
        </RouterLink>
      </div>

      <button type="submit" class="auth-submit" :disabled="loading">
        {{ loading ? t("auth.login.submitting") : t("auth.login.submit") }}
      </button>
    </form>

    <template #footer>
      {{ t("auth.login.noAccount") }}
      <RouterLink :to="{ name: 'signup', query: route.query }">
        {{ t("auth.login.signupLink") }}
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import AuthCard from "../../components/auth/AuthCard.vue";
import PasswordInput from "../../components/auth/PasswordInput.vue";
import { useAuthStore } from "../../store/auth/auth";
import { safeRedirect } from "../../router/redirect";

const { t } = useI18n();
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
    error.value = t("auth.login.missing");
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
