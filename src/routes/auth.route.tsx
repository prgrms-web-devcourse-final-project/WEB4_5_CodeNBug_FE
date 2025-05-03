import { lazyLoad } from "@/lib/lazy";
import { RouteObject } from "react-router";

export const authRoutes: RouteObject[] = [
  // {
  //   path: "tickets/queue/:eventId",
  //   lazy: lazyLoad(() => import("@/pages/tickets/queue")),
  // },
  // {
  //   path: "tickets/select/:eventId",
  //   lazy: lazyLoad(() => import("@/pages/tickets/select")),
  // },
  // {
  //   path: "tickets/pay/:orderId",
  //   lazy: lazyLoad(() => import("@/pages/tickets/pay")),
  // },
  // {
  //   path: "tickets/done/:orderId",
  //   lazy: lazyLoad(() => import("@/pages/tickets/done")),
  // },
  {
    path: "my",
    lazy: lazyLoad(() => import("@/pages/my/my.page")),
  },
];
