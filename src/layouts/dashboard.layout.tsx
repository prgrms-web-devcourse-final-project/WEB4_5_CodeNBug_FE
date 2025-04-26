import { Outlet } from "react-router";

type DashboardLayoutProps = {
  role: "admin" | "manager";
};

export const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  console.log(role);

  return <Outlet />;
};
