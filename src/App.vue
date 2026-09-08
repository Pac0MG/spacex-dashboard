<template>
  <header class="header">
    <div class="header-content">
      <h1>SpaceX Dashboard</h1>

      <nav class="nav">
        <RouterLink to="/launches"> Launches </RouterLink>

        <RouterLink to="/rockets"> Rockets </RouterLink>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<script setup></script>

<style>
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
  min-height: 140px;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
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

.header-content h1 {
  font-size: 28px;
  margin: 0;
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

@media (max-width: 640px) {
  .header {
    min-height: auto;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
  }

  .header-content h1 {
    font-size: 22px;
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
