import { lazyLoad } from "@/lib/lazy";
import { RouteObject } from "react-router";

export const managerRoute: RouteObject[] = [
  {
    path: "manager",
    lazy: lazyLoad(() => import("@/pages/manager/manager.page")),
  },
];
