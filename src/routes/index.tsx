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
import { RouteErrorPage } from "@/pages/not-found";
import { managerRoute } from "./manager.route";
import { ManagerLayout, requireManagerLoader } from "@/layouts/manager.layout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
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
        path: "events/:eventId/book",
        lazy: lazyLoad(() => import("@/pages/events/book.page")),
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
        loader: requireUnauthLoader,
        children: [
          {
            path: "auth/google/callback",
            lazy: lazyLoad(() => import("@/pages/social/google.page")),
          },
          {
            path: "auth/kakao/callback",
            lazy: lazyLoad(() => import("@/pages/social/kakao.page")),
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: authRoutes,
        loader: requireAuthLoader,
      },
      {
        path: "admin",
        element: <DashboardLayout role="admin" />,
        children: adminRoutes,
      },
      {
        element: <ManagerLayout />,
        loader: requireManagerLoader,
        children: managerRoute,
      },
    ],
  },
]);
