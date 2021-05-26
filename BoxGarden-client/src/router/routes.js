const routes = [
  {
    path: "/",
    component: () => import("layouts/WelcomePageLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/WelcomePageIndex.vue")
      }
    ]
  },
  {
    path: "/Login",
    component: () => import("layouts/LoginPageLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginIndex.vue")
      }
    ]
  },
  {
    path: "/Administration",
    component: () => import("layouts/BoxGardenSystemLayout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "/Sensors",
        meta: { auth: true },
        component: () => import("pages/SensorIndex.vue")
      },
      {
        path: "/BoxGardens",
        meta: { auth: true },
        component: () => import("pages/BoxGardensIndex.vue")
      },
      {
        path: "/Measurements",
        meta: { auth: true },
        component: () => import("pages/MeasurementsIndex.vue")
      },
      {
        path: "/Users",
        meta: { auth: true },
        component: () => import("pages/UsersIndex.vue")
      }
    ]
  }
];
// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}
export default routes;
