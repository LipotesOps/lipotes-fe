/** When your routing table is too long, you can split it into small modules**/

// import Layout from "@/layout";
import home from "@/components/home.vue";

const itscAdminRouter = {
  path: "/flow-manage",
  // component: Layout,
  component: home,
  redirect: "/flow-manage/flow",
  name: "flowManage",
  meta: {
    title: "流程管理",
    icon: "example"
  },
  children: [
    {
      path: "flow",
      component: () => import("@/views/itsc-flow/index.vue"),
      name: "itsc-home",
      meta: { title: "流程设计", icon: "documentation" }
    }
  ]
};

export { itscAdminRouter };
