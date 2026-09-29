<template>
  <div class="avatar-picker">
    <button
      type="button"
      class="avatar-picker-circle"
      aria-label="Choose a profile photo"
      @click="input.click()"
    >
      <img v-if="modelValue" :src="modelValue" alt="Profile photo preview" />
      <svg
        v-else
        class="avatar-picker-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3z"
        />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
      <span class="avatar-picker-overlay">
        {{ modelValue ? "Change" : "Add photo" }}
      </span>
    </button>

    <button
      v-if="modelValue"
      type="button"
      class="avatar-picker-remove"
      @click="remove"
    >
      Remove photo
    </button>
    <span v-else class="avatar-picker-hint">Optional</span>

    <span v-if="error" class="auth-field-error" role="alert">{{ error }}</span>

    <input
      ref="input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      @change="onFile"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  modelValue: { type: String, default: null },
});
const emit = defineEmits(["update:modelValue"]);

const OUTPUT_SIZE = 256;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

const input = ref(null);
const error = ref("");

// Center-crops to a square and downsizes, so the upload stays small no matter
// how large the original is.
async function toAvatar(file) {
  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = OUTPUT_SIZE;

    const ctx = canvas.getContext("2d");
    // JPEG has no transparency; without this, transparent PNGs turn black.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );

    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    bitmap.close();
  }
}

async function onFile(event) {
  const file = event.target.files[0];
  event.target.value = ""; // lets the same file be picked again
  if (!file) return;

  error.value = "";

  if (!file.type.startsWith("image/") || file.size > MAX_INPUT_BYTES) {
    error.value = "Choose an image file smaller than 10 MB.";
    return;
  }

  try {
    emit("update:modelValue", await toAvatar(file));
  } catch {
    error.value = "That image couldn't be read. Try a different one.";
  }
}

function remove() {
  error.value = "";
  emit("update:modelValue", null);
}
</script>

<style>
.avatar-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-picker-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  padding: 0;
  overflow: hidden;
  border: 2px dashed var(--color-border-strong);
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: pointer;
}

.avatar-picker-circle:has(img) {
  border-style: solid;
}

.avatar-picker-circle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.avatar-picker-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-picker-icon {
  width: 40px;
  height: 40px;
}

.avatar-picker-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 6px 0 8px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  background: rgba(15, 23, 42, 0.65);
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.15s;
}

.avatar-picker-circle:hover .avatar-picker-overlay,
.avatar-picker-circle:focus-visible .avatar-picker-overlay {
  opacity: 1;
}

.avatar-picker-remove {
  padding: 0;
  border: none;
  background: none;
  font-size: 13px;
  color: var(--color-accent);
  cursor: pointer;
}

.avatar-picker-remove:hover {
  text-decoration: underline;
}

.avatar-picker-hint {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
