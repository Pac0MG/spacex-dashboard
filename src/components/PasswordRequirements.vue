<template>
  <ul class="password-requirements" aria-label="Password requirements">
    <li
      v-for="rule in rules"
      :key="rule.id"
      :class="rule.met ? 'is-met' : 'is-unmet'"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path v-if="rule.met" d="M5 12.5l4.5 4.5L19 7" />
        <path v-else d="M6 6l12 12M18 6L6 18" />
      </svg>
      {{ rule.label }}
      <span class="visually-hidden">
        {{ rule.met ? "(met)" : "(not met)" }}
      </span>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";
import { PASSWORD_RULES } from "../utils/passwordRules";

const props = defineProps({
  password: { type: String, default: "" },
});

const rules = computed(() =>
  PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(props.password) })),
);
</script>

<style scoped>
.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease;
}

.password-requirements svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.is-unmet {
  color: var(--color-requirement-unmet);
}

.is-met {
  color: var(--color-requirement-met);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
