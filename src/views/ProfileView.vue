<template>
  <section class="auth-card profile-card">
    <UserAvatar :src="user.avatar" :name="user.name" :size="128" />

    <h1>{{ user.name }}</h1>
    <p class="profile-username">@{{ user.username }}</p>

    <dl class="profile-details">
      <div>
        <dt>Name</dt>
        <dd>{{ user.name }}</dd>
      </div>
      <div>
        <dt>Username</dt>
        <dd>{{ user.username }}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{{ user.email }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { computed } from "vue";
import UserAvatar from "../components/UserAvatar.vue";
import { useAuthStore } from "../store/auth";

// The route requires a session, so the user is always set here.
const user = computed(() => useAuthStore().user);
</script>

<style>
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-card h1 {
  margin-top: 20px;
  overflow-wrap: anywhere;
}

.profile-username {
  margin: 0 0 28px;
  color: var(--color-text-muted);
}

.profile-details {
  width: 100%;
  margin: 0;
  text-align: left;
  border-top: 1px solid var(--color-border);
}

.profile-details > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.profile-details dt {
  font-size: 14px;
  font-weight: bold;
}

.profile-details dd {
  margin: 0;
  color: var(--color-text-muted);
  overflow-wrap: anywhere;
  text-align: right;
}
</style>
