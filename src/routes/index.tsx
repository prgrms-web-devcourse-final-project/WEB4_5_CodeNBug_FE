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
import {
  oauthCallbackLoader,
  OAuthCallbackPage,
} from "@/pages/social/oauth-callback.page";

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
        path: "support",
        lazy: lazyLoad(() => import("@/pages/support.page")),
      },
      {
        path: "auth",
        lazy: lazyLoad(() => import("@/pages/auth.page")),
        loader: requireUnauthLoader,
      },
      {
        path: "auth/:provider/callback",
        element: <OAuthCallbackPage />,
        loader: oauthCallbackLoader,
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
