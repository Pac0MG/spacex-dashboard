<template>
  <section class="next-launch-hero">
    <div class="hero-stars" aria-hidden="true"></div>

    <div class="hero-content">
      <div class="hero-heading">
        <span class="hero-live-dot" aria-hidden="true"></span>
        <span class="hero-eyebrow">Next Launch</span>
      </div>

      <div class="hero-main">
        <div class="hero-patch">
          <img
            v-if="launch.links?.patch?.small"
            :src="launch.links.patch.small"
            :alt="`Mission patch for ${launch.name}`"
          />
          <span v-else class="hero-patch-fallback">🚀</span>
        </div>

        <div class="hero-info">
          <h2>{{ launch.name }}</h2>
          <p class="hero-date">{{ formattedDate }}</p>
          <RouterLink class="hero-link" :to="`/launches/${launch.id}`">
            View mission details
          </RouterLink>
        </div>
      </div>

      <div v-if="!hasLaunched" class="countdown">
        <div
          v-for="unit in countdownUnits"
          :key="unit.label"
          class="countdown-unit"
        >
          <span class="countdown-value">{{ unit.value }}</span>
          <span class="countdown-label">{{ unit.label }}</span>
        </div>
      </div>

      <p v-else class="hero-liftoff">🚀 Liftoff!</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  launch: {
    type: Object,
    required: true,
  },
});

const now = ref(Date.now());
let timerId = null;

onMounted(() => {
  timerId = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerId);
});

const formattedDate = computed(() => {
  return new Date(props.launch.date_utc).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const remainingMs = computed(() => {
  return new Date(props.launch.date_utc).getTime() - now.value;
});

const hasLaunched = computed(() => remainingMs.value <= 0);

function pad(value) {
  return String(value).padStart(2, "0");
}

const countdownUnits = computed(() => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs.value / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: pad(days) },
    { label: "Hours", value: pad(hours) },
    { label: "Min", value: pad(minutes) },
    { label: "Sec", value: pad(seconds) },
  ];
});
</script>

<style scoped>
.next-launch-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 30px;
  padding: 28px 36px;
  color: #f8fafc;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%);
}

.hero-stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      2px 2px at 20px 30px,
      rgba(255, 255, 255, 0.5),
      transparent
    ),
    radial-gradient(
      1.5px 1.5px at 90px 80px,
      rgba(255, 255, 255, 0.4),
      transparent
    ),
    radial-gradient(
      1.5px 1.5px at 160px 40px,
      rgba(255, 255, 255, 0.35),
      transparent
    ),
    radial-gradient(
      2px 2px at 230px 100px,
      rgba(255, 255, 255, 0.4),
      transparent
    ),
    radial-gradient(
      1.5px 1.5px at 300px 20px,
      rgba(255, 255, 255, 0.3),
      transparent
    );
  background-repeat: repeat;
  background-size: 340px 140px;
  opacity: 0.8;
  pointer-events: none;
}

.hero-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  animation: pulse 2s infinite;
}

.hero-eyebrow {
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #93c5fd;
}

.hero-main {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-patch {
  width: 84px;
  height: 84px;
  min-width: 84px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-patch img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-patch-fallback {
  font-size: 34px;
}

.hero-info h2 {
  margin: 0 0 6px;
  font-size: 24px;
}

.hero-date {
  margin: 0 0 10px;
  color: #cbd5e1;
}

.hero-link {
  color: #93c5fd;
  font-weight: bold;
  text-decoration: none;
}

.hero-link:hover {
  text-decoration: underline;
}

.countdown {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 64px;
  padding: 10px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.countdown-value {
  font-family: "Orbitron", sans-serif;
  font-size: 26px;
  font-weight: 700;
}

.countdown-label {
  margin-top: 4px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #cbd5e1;
}

.hero-liftoff {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
}

@media (max-width: 600px) {
  .next-launch-hero {
    padding: 22px 20px;
  }

  .hero-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .countdown-unit {
    min-width: 56px;
  }
}
</style>
