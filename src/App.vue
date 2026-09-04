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
