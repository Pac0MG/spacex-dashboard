import { createRouter, createWebHistory } from "vue-router";
import LaunchView from "../views/LaunchView.vue";
import LaunchDetailView from "../views/LaunchDetailView.vue";
import RocketsView from "../views/RocketsView.vue";

const router = createRouter({
  history: createWebHistory(),

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
  ],
});

export default router;
