import Vue from "vue";
import VueRouter from "vue-router";
import Standings from "@/components/Standings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Standings",
    component: Standings,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
