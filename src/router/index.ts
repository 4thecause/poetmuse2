import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase/config";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    component: SignUp,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (!requiresAuth && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
