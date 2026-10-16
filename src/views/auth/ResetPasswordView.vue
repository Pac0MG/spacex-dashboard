<template>
  <AuthCard
    :title="t('auth.reset.title')"
    :subtitle="t('auth.reset.subtitle')"
  >
    <div v-if="!token" class="auth-form">
      <p class="auth-error" role="alert">
        {{ t("auth.reset.incomplete") }}
      </p>
    </div>

    <form v-else class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field" :class="{ 'has-error': fieldError }">
        <label for="password">{{ t("auth.reset.password") }}</label>
        <PasswordInput
          id="password"
          v-model="password"
          autocomplete="new-password"
          minlength="9"
          autofocus
          required
        />
        <span v-if="fieldError" class="auth-field-error">{{ fieldError }}</span>
        <PasswordRequirements v-if="password" :password="password" />
        <span v-else class="auth-field-hint">
          {{ t("auth.passwordHint") }}
        </span>
      </div>

      <div class="auth-field" :class="{ 'has-error': confirmError }">
        <label for="confirm">{{ t("auth.reset.confirm") }}</label>
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
        {{ loading ? t("auth.reset.submitting") : t("auth.reset.submit") }}
      </button>
    </form>

    <template #footer>
      <RouterLink :to="{ name: 'forgot-password' }">
        {{ t("auth.reset.newLink") }}
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
import PasswordRequirements from "../../components/auth/PasswordRequirements.vue";
import { resetPasswordRequest } from "../../services/auth";
import { meetsPasswordRules } from "../../utils/passwordRules";

const { t } = useI18n();
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

  if (!meetsPasswordRules(password.value)) {
    fieldError.value = t("auth.rulesNotMet");
    return;
  }
  if (password.value !== confirm.value) {
    confirmError.value = t("auth.mismatch");
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
