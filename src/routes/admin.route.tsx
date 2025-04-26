import { lazyLoad } from "@/lib/lazy";
import { RouteObject } from "react-router";

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    lazy: lazyLoad(() => import("@/pages/admin/home.page")),
  },
  {
    path: "users",
    lazy: lazyLoad(() => import("@/pages/admin/users.page")),
  },
  {
    path: "blacklist",
    lazy: lazyLoad(() => import("@/pages/admin/blacklist.page")),
  },
  {
    path: "systems",
    lazy: lazyLoad(() => import("@/pages/admin/systems.page")),
  },
  {
    path: "settings",
    lazy: lazyLoad(() => import("@/pages/admin/settings.page")),
  },
];
