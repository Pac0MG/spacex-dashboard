import { createRouter, createWebHistory } from "vue-router";
import LaunchView from "../views/LaunchView.vue";
import LaunchDetailView from "../views/LaunchDetailView.vue";
import RocketsView from "../views/RocketsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

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
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;
