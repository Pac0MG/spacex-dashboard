<template>
  <header class="header">
    <div class="header-content">
      <span class="brand">SpaceX</span>

      <nav class="nav">
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
</template>

<script setup></script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #222;
}

.header {
  width: 100%;
  min-height: 200px;
  color: white;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #111827;
  background-image:
    linear-gradient(rgba(17, 24, 39, 0.55), rgba(17, 24, 39, 0.8)),
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
  font-size: 28px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: white;
}

.nav {
  display: flex;
  gap: 12px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 14px 22px;
  border-radius: 8px;
  font-size: 17px;
  transition: background-color 0.2s;
}

.nav a:hover {
  background-color: #374151;
}

.nav a.router-link-active {
  background-color: #2563eb;
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
