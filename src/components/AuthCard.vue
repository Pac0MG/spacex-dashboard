<template>
  <section class="auth-card">
    <h1>{{ title }}</h1>
    <p class="auth-subtitle">{{ subtitle }}</p>

    <slot />

    <p class="auth-switch">
      <slot name="footer" />
    </p>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<style>
.auth-card {
  width: 100%;
  max-width: 440px;
  margin: 20px auto;
  padding: 36px 32px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.auth-card h1 {
  margin: 0 0 6px;
  font-family: "Orbitron", sans-serif;
  font-size: 26px;
}

.auth-subtitle {
  margin: 0 0 24px;
  color: var(--color-text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field label {
  font-size: 14px;
  font-weight: bold;
}

.auth-field input {
  padding: 12px 14px;
  font-size: 16px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
}

.auth-field input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.auth-field.has-error input {
  border-color: var(--color-status-failure-text);
}

.auth-field-error {
  font-size: 13px;
  color: var(--color-status-failure-text);
}

.auth-field-hint {
  font-size: 13px;
  color: var(--color-text-muted);
}

.auth-error {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  background: var(--color-status-failure-bg);
  color: var(--color-status-failure-text);
}

.auth-submit {
  padding: 13px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.auth-submit:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch {
  margin: 24px 0 0;
  text-align: center;
  color: var(--color-text-muted);
}

.auth-switch a {
  color: var(--color-accent);
  font-weight: bold;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 28px 20px;
  }
}
</style>
