import { AnimatePresence, motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login";
import { SignupForm } from "@/components/auth/signup";
import {
  LoaderFunction,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router";
import { useLayoutEffect, useState } from "react";
import { getMyInfo } from "@/services/user.service";
import { ResMyInfo } from "@/schemas/user.schema";
import axios from "axios";

const AuthPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const changeMode = (next: "login" | "signup") => {
    setMode(next);
    params.set("mode", next);
    navigate(
      { pathname: "/auth", search: params.toString() },
      { replace: true }
    );
  };

  useLayoutEffect(() => {
    const p = params.get("mode");
    if (p === "login" || p === "signup") setMode(p);
  }, [params]);

  return (
    <section className="flex h-full items-center justify-center bg-muted/40 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-4 w-full h-full max-w-md rounded-lg border bg-card p-8 shadow-lg"
        layout
      >
        <Tabs
          value={mode}
          onValueChange={(v) => changeMode(v as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <TabsContent key="login" value="login" forceMount>
                <MotionWrapper>
                  <LoginForm />
                </MotionWrapper>
              </TabsContent>
            ) : (
              <TabsContent key="signup" value="signup" forceMount>
                <MotionWrapper>
                  <SignupForm />
                </MotionWrapper>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </section>
  );
};

const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
    layout
  >
    {children}
  </motion.div>
);

export const authGuardLoader: LoaderFunction = async () => {
  try {
    const { data: res } = await getMyInfo();

    const parsed = ResMyInfo.safeParse(res);
    if (!parsed.success) {
      return null;
    }

    if ("data" in parsed.data) {
      throw redirect("/");
    }

    return null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};

export default AuthPage;
