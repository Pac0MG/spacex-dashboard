<template>
  <section class="not-found">
    <p class="not-found-code">404</p>

    <div class="not-found-icon" aria-hidden="true">🛰️</div>

    <h1>Lost in space</h1>

    <p class="not-found-text">
      This page doesn't exist, or it was launched into an orbit we can't reach.
    </p>

    <RouterLink to="/launches" class="not-found-link">
      Back to Launches
    </RouterLink>
  </section>
</template>

<script setup></script>

<style scoped>
.not-found {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: var(--color-surface);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.not-found-code {
  margin: 0;
  font-family: "Orbitron", sans-serif;
  font-weight: 900;
  font-size: 96px;
  line-height: 1;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.not-found-icon {
  font-size: 40px;
  margin: 10px 0 20px;
  animation: float 3s ease-in-out infinite;
}

.not-found h1 {
  margin: 0 0 10px;
}

.not-found-text {
  max-width: 420px;
  margin: 0 0 30px;
  color: var(--color-text-muted);
}

.not-found-link {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.not-found-link:hover {
  background: #1d4ed8;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 600px) {
  .not-found-code {
    font-size: 64px;
  }
}
</style>
