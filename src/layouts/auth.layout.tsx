import { fetchSession } from "@/services/fetch-session";
import { LoaderFunction, Outlet, redirect } from "react-router";

export const AuthLayout = () => {
  return <Outlet />;
};

export const requireAuthLoader: LoaderFunction = async () => {
  const me = await fetchSession();
  if (!me) throw redirect("/auth?mode=login");
  return null;
};
