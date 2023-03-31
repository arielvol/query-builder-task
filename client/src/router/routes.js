const routes = [

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/RegisterAndLogin.vue") },
      {
        path: "/query-builder",
        name: "builder",
        component: () => import("pages/QueryBuilder.vue") },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
