import { lazyLoad } from "@/lib/lazy";
import { RouteObject } from "react-router";

export const authRoutes: RouteObject[] = [
  {
    path: "my",
    lazy: lazyLoad(() => import("@/pages/my/my.page")),
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
    path: "events/:eventId/pay",
    lazy: lazyLoad(() => import("@/pages/pay/pay.page")),
  },
  {
    path: "payments",
    children: [
      {
        path: "success",
        lazy: lazyLoad(() => import("@/pages/pay/success.page")),
      },
      {
        path: "complete",
        lazy: lazyLoad(() => import("@/pages/pay/complete.page")),
      },
      {
        path: "fail",
        lazy: lazyLoad(() => import("@/pages/pay/fail.page")),
      },
    ],
  },
];
