import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import firebase from 'firebase';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: '/dashboardFono',
    name: 'Dashboard Fono',
    component: () =>
      import(/* webpackChunkName: "dashboardFono" */ '../views/DashboardFono.vue'),
    meta: {
      authRequired: true,
    },
    props: true
  },
  {
    path: '/dashboardPaciente',
    name: 'Dashboard Paciente',
    component: () =>
      import(/* webpackChunkName: "dashboardPaciente" */ '../views/DashboardPaciente.vue'),
    meta: {
      authRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
      if (firebase.auth().currentUser) {
          next();
      } else {
          alert('You must be logged in to see this page');
          next({
              path: '/',
          });
      }
  } else {
      next();
  }
});

export default router;
