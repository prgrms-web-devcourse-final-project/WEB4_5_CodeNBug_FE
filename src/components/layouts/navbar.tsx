import { NAV_ITEMS } from "@/constants/navbar";
import { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Loader2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useMyInfo } from "@/services/query/user.query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { toast } from "sonner";

export const Navbar = () => {
  const { pathname } = useLocation();

  const { data: myInfo } = useMyInfo();

  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER.MY,
        type: "all",
      });
    },
    onError: () => toast.error("로그아웃에 실패하였습니다."),
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-primary"
        >
          Code<span className="text-blue-600"> & </span>Bug
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, path }) => (
            <NavLink key={path} to={path} active={pathname.startsWith(path)}>
              {label}
            </NavLink>
          ))}
          <Link
            to="/manager"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            판매자 센터
          </Link>
          <ThemeToggle />
          {myInfo ? (
            <Button size="sm" onClick={() => logoutMutation()}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "로그아웃"
              )}
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">로그인</Link>
            </Button>
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="메뉴 열기">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col px-4 gap-6 py-8">
            {NAV_ITEMS.map(({ label, path }) => (
              <Link key={path} to={path} className="text-lg font-medium">
                {label}
              </Link>
            ))}
            <Link
              to="/manager"
              className="text-lg font-medium text-muted-foreground"
            >
              판매자 센터
            </Link>
            <ThemeToggle />
            <Button asChild>
              <Link to="/auth">로그인</Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

const NavLink = ({
  to,
  active,
  children,
}: PropsWithChildren<{ to: string; active: boolean }>) => (
  <Link
    to={to}
    className={cn(
      "text-sm font-medium transition-colors",
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);
