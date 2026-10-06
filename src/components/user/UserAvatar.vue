<template>
  <span
    class="user-avatar"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.4}px` }"
    aria-hidden="true"
  >
    <img v-if="src" :src="src" alt="" />
    <template v-else>{{ initials }}</template>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: { type: String, default: null },
  name: { type: String, default: "" },
  size: { type: Number, default: 40 },
});

// Shown when there's no photo: first letters of the first two words.
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join(""),
);
</script>

<style>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  user-select: none;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
