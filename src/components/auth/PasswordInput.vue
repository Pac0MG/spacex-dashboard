<template>
  <div class="password-field">
    <input
      v-bind="$attrs"
      :value="modelValue"
      :type="visible ? 'text' : 'password'"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <button
      type="button"
      class="password-toggle"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      :aria-pressed="visible"
      :title="visible ? 'Hide password' : 'Show password'"
      @click="visible = !visible"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path v-if="visible" d="M4 4l16 16" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Attributes (id, autocomplete, required...) belong on the <input>, not the wrapper.
defineOptions({ inheritAttrs: false });

defineProps({
  modelValue: { type: String, default: "" },
});
defineEmits(["update:modelValue"]);

const visible = ref(false);
</script>

<style scoped>
.password-field {
  position: relative;
  display: flex;
}

.password-field input {
  width: 100%;
  padding-right: 46px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.password-toggle:hover {
  color: var(--color-text);
}

.password-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}
</style>
