import { fetchSession } from "@/services/fetch-session";
import { LoaderFunction, Outlet, redirect } from "react-router";

export const ManagerLayout = () => <Outlet />;

export const requireManagerLoader: LoaderFunction = async () => {
  const me = await fetchSession();

  if (!me) throw redirect("/auth?mode=login");

  if (me.data?.role !== "ROLE_MANAGER") throw redirect("/");

  return null;
};
