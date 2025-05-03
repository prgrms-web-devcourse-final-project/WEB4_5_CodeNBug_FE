import { lazyLoad } from "@/lib/lazy";
import { createBrowserRouter } from "react-router";
import { authRoutes } from "./auth.route";
import { adminRoutes } from "./admin.route";
import {
  AuthLayout,
  DashboardLayout,
  RootLayout,
  requireAuthLoader,
} from "@/layouts";
import { requireUnauthLoader } from "@/pages/auth.page";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: lazyLoad(() => import("@/pages/home.page")),
      },
      {
        path: "events",
        lazy: lazyLoad(() => import("@/pages/events/list.page")),
      },
      {
        path: "events/:eventId",
        lazy: lazyLoad(() => import("@/pages/events/detail.page")),
      },
      {
        path: "support",
        lazy: lazyLoad(() => import("@/pages/support.page")),
      },
      {
        path: "auth",
        lazy: lazyLoad(() => import("@/pages/auth.page")),
        loader: requireUnauthLoader,
      },
      {
        element: <AuthLayout />,
        children: authRoutes,
        loader: requireAuthLoader,
      },
      // {
      //   path: "manager",
      //   element: <DashboardLayout role="manager" />,
      //   children: managerRoutes,
      // },
      {
        path: "admin",
        element: <DashboardLayout role="admin" />,
        children: adminRoutes,
      },

      {
        path: "*",
        lazy: lazyLoad(() => import("@/pages/not-found")),
      },
    ],
  },
]);
