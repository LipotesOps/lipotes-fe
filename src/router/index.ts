import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Layout from "@/layout/index.vue";
import { itscAdminRouter } from "./modules/admin";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        // component: () => import('@/views/dashboard/index'),
        name: "Dashboard",
        meta: { title: "Dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  itscAdminRouter
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
