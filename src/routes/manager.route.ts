import { lazyLoad } from "@/lib/lazy";
import { RouteObject } from "react-router";

export const managerRoutes: RouteObject[] = [
  {
    index: true,
    lazy: lazyLoad(() => import("@/pages/manager/dashboard")),
  },
  {
    path: "events",
    lazy: lazyLoad(() => import("@/pages/manager/events/list")),
  },
  {
    path: "events/new",
    lazy: lazyLoad(() => import("@/pages/manager/events/new")),
  },
  {
    path: "events/:eventId/edit",
    lazy: lazyLoad(() => import("@/pages/manager/events/edit")),
  },
  {
    path: "events/:eventId/seats",
    lazy: lazyLoad(() => import("@/pages/manager/events/seats")),
  },
  {
    path: "events/:eventId/stats",
    lazy: lazyLoad(() => import("@/pages/manager/events/stats")),
  },
  {
    path: "refunds",
    lazy: lazyLoad(() => import("@/pages/manager/refunds")),
  },
];
