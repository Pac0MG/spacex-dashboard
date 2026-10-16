<template>
  <AuthCard
    :title="t('auth.forgot.title')"
    :subtitle="t('auth.forgot.subtitle')"
  >
    <p v-if="sent" class="auth-success" role="status">
      {{ t("auth.forgot.sent", { email }) }}
    </p>

    <form v-else class="auth-form" novalidate @submit.prevent="submit">
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <div class="auth-field">
        <label for="email">{{ t("auth.fields.email") }}</label>
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
        {{ loading ? t("auth.forgot.submitting") : t("auth.forgot.submit") }}
      </button>
    </form>

    <template #footer>
      <RouterLink :to="{ name: 'login', query: route.query }">
        {{ t("auth.forgot.back") }}
      </RouterLink>
    </template>
  </AuthCard>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AuthCard from "../../components/auth/AuthCard.vue";
import { forgotPasswordRequest } from "../../services/auth";

const { t } = useI18n();
const route = useRoute();

const email = ref("");
const error = ref("");
const loading = ref(false);
const sent = ref(false);

async function submit() {
  error.value = "";

  if (!email.value.trim()) {
    error.value = t("auth.forgot.missing");
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
