import { createRouter, createWebHistory } from "vue-router";
import LaunchView from "../views/launches/LaunchView.vue";
import LaunchDetailView from "../views/launches/LaunchDetailView.vue";
import RocketsView from "../views/rockets/RocketsView.vue";
import NotFoundView from "../views/errors/NotFoundView.vue";
import LoginView from "../views/auth/LoginView.vue";
import SignupView from "../views/auth/SignupView.vue";
import ProfileView from "../views/user/ProfileView.vue";
import ForgotPasswordView from "../views/auth/ForgotPasswordView.vue";
import ResetPasswordView from "../views/auth/ResetPasswordView.vue";
import { useAuthStore } from "../store/auth/auth";

const router = createRouter({
  history: createWebHistory(),

  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },

  routes: [
    {
      path: "/",
      redirect: "/launches",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      meta: { guestOnly: true },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPasswordView,
      meta: { guestOnly: true },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPasswordView,
      meta: { guestOnly: true },
    },
    {
      path: "/launches",
      name: "launches",
      component: LaunchView,
    },
    {
      path: "/launches/:id",
      name: "launch-detail",
      component: LaunchDetailView,
    },
    {
      path: "/rockets",
      name: "rockets",
      component: RocketsView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

// Every route requires a session except the ones marked `guestOnly`.
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.init();

  if (to.meta.guestOnly) {
    return auth.isAuthenticated ? { name: "launches" } : true;
  }

  if (!auth.isAuthenticated) {
    return {
      name: "login",
      query: to.fullPath === "/" ? {} : { redirect: to.fullPath },
    };
  }

  return true;
});

export default router;
