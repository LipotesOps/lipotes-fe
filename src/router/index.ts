import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import { itscAdminRouter } from "./modules/admin";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [itscAdminRouter];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
