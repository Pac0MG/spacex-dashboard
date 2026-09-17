<template>
  <header class="header">
    <div class="header-content">
      <a
        href="https://www.spacex.com"
        target="_blank"
        rel="noopener noreferrer"
        class="brand"
      >
        SpaceX
      </a>

      <nav class="nav">
        <GlobalSearch />

        <button
          type="button"
          class="theme-toggle"
          :class="{ 'is-dark': themeStore.isDark }"
          role="switch"
          :aria-checked="themeStore.isDark"
          :aria-label="
            themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'
          "
          @click="themeStore.toggleTheme"
        >
          <span class="theme-track">
            <span class="theme-knob">
              <svg
                class="theme-knob-icon icon-sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>

              <svg
                class="theme-knob-icon icon-moon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                <path d="M19 3v4" />
                <path d="M21 5h-4" />
              </svg>
            </span>
          </span>
        </button>

        <RouterLink to="/launches"> Launches </RouterLink>

        <RouterLink to="/rockets"> Rockets </RouterLink>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component" />
      </transition>
    </RouterView>
  </main>

  <UseToast />
</template>

<script setup>
import { useThemeStore } from "./store/theme";
import UseToast from "./components/UseToast.vue";
import GlobalSearch from "./components/GlobalSearch.vue";

const themeStore = useThemeStore();
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");

:root {
  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-subtle-bg: #f3f4f6;
  --color-skeleton-base: #e5e7eb;
  --color-shimmer: rgba(255, 255, 255, 0.6);
  --color-border: #ddd;
  --color-border-strong: #ccc;
  --color-text: #222;
  --color-text-muted: #666;
  --color-text-faint: #777;

  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-contrast: #ffffff;

  --color-status-success-bg: #dcfce7;
  --color-status-success-text: #166534;
  --color-status-failure-bg: #fee2e2;
  --color-status-failure-text: #991b1b;
  --color-status-upcoming-bg: #dbeafe;
  --color-status-upcoming-text: #1e40af;
  --color-status-retired-text: #4b5563;

  --color-favorite-idle: #9ca3af;
  --color-favorite-active: #f59e0b;
  --color-favorite-active-bg: #fffbeb;
  --color-favorite-active-text: #b45309;
  --color-favorite-chip-bg: rgba(255, 255, 255, 0.85);
  --color-favorite-chip-bg-hover: #ffffff;

  --color-header-bg: #111827;
  --color-header-overlay-start: rgba(17, 24, 39, 0.55);
  --color-header-overlay-end: rgba(17, 24, 39, 0.8);
  --color-header-text: #ffffff;
  --color-nav-hover-bg: #374151;

  --color-header-search-bg: rgba(255, 255, 255, 0.12);
  --color-header-search-bg-hover: rgba(255, 255, 255, 0.2);
  --color-header-search-kbd-bg: rgba(255, 255, 255, 0.15);

  --color-overlay-bg: rgba(2, 6, 23, 0.6);

  --color-toggle-track-bg: rgba(255, 255, 255, 0.18);
  --color-toggle-track-bg-active: rgba(255, 255, 255, 0.12);
  --color-toggle-knob-bg: #ffffff;
  --color-toggle-knob-shadow: rgba(0, 0, 0, 0.35);
  --color-toggle-icon-color: #1f2937;

  --color-notfound-gradient-start: var(--color-accent);
  --color-notfound-gradient-end: #7c3aed;

  --color-hero-bg-start: #0f172a;
  --color-hero-bg-mid: #1e3a8a;
  --color-hero-bg-end: #1d4ed8;
  --color-hero-text: #f8fafc;
  --color-hero-eyebrow: #93c5fd;
  --color-hero-subtext: #cbd5e1;
  --color-hero-live-dot: #34d399;
  --color-hero-live-dot-glow: rgba(52, 211, 153, 0.6);
  --color-hero-panel-bg: rgba(255, 255, 255, 0.1);

  --color-hero-star-rgb: 255, 255, 255;

  --color-toast-shadow: rgba(0, 0, 0, 0.15);
}

:root.dark {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-subtle-bg: #273449;
  --color-skeleton-base: #334155;
  --color-shimmer: rgba(255, 255, 255, 0.08);
  --color-border: #334155;
  --color-border-strong: #475569;
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-text-faint: #94a3b8;
  --color-toast-shadow: rgba(0, 0, 0, 0.4);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.header {
  width: 100%;
  min-height: 200px;
  color: var(--color-header-text);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-header-bg);
  background-image:
    linear-gradient(
      var(--color-header-overlay-start),
      var(--color-header-overlay-end)
    ),
    url("https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/150000/150456/iss066e024707_lrg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-family: "Orbitron", sans-serif;
  font-weight: 900;
  font-size: 50px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-header-text);
  text-decoration: none;
}

.brand:hover {
  text-decoration: underline;
}

.nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0 8px;
  cursor: pointer;
}

.theme-track {
  position: relative;
  width: 42px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-toggle-track-bg);
  transition: background-color 0.2s;
}

.theme-toggle.is-dark .theme-track {
  background: var(--color-toggle-track-bg-active);
}

.theme-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-toggle-knob-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px var(--color-toggle-knob-shadow);
  transition: transform 0.2s ease;
}

.theme-toggle.is-dark .theme-knob {
  transform: translateX(20px);
}

.theme-knob-icon {
  position: absolute;
  width: 13px;
  height: 13px;
  color: var(--color-toggle-icon-color);
  transition: opacity 0.15s ease;
}

.icon-sun {
  opacity: 1;
}

.icon-moon {
  opacity: 0;
}

.theme-toggle.is-dark .icon-sun {
  opacity: 0;
}

.theme-toggle.is-dark .icon-moon {
  opacity: 1;
}

.nav a {
  color: var(--color-header-text);
  text-decoration: none;
  padding: 14px 22px;
  border-radius: 8px;
  font-size: 17px;
  transition: background-color 0.2s;
}

.nav a:hover {
  background-color: var(--color-nav-hover-bg);
}

.nav a.router-link-active {
  background-color: var(--color-accent);
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .header {
    min-height: auto;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 14px;
    padding: 20px;
  }

  .brand {
    font-size: 22px;
    letter-spacing: 2px;
  }

  .nav {
    width: 100%;
    gap: 8px;
  }

  .nav a {
    flex: 1;
    text-align: center;
    padding: 10px 12px;
    font-size: 15px;
  }

  .container {
    padding: 20px;
  }
}
</style>
