import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { OAuthButton } from "./oauth-button";
import { Link, useNavigate } from "react-router";
import { loginPayloadSchema, LoginPayloadType } from "@/schemas/auth.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { QUERY_KEY } from "@/lib/query/query-key";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Switch } from "../ui/switch";
import { motion } from "motion/react";
import { getMyInfo } from "@/services/user.service";

const LOCK_KEY = "login-lock-until";
const LOCK_DURATION_MS = 5 * 60 * 1_000;

const getLockUntil = () => {
  const v = localStorage.getItem(LOCK_KEY);
  return v ? +v : undefined;
};
const setLockUntil = (ts: number) =>
  localStorage.setItem(LOCK_KEY, ts.toString());
const clearLockUntil = () => localStorage.removeItem(LOCK_KEY);

export const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [domain, setDomain] = useState<string>();
  const [remaining, setRemaining] = useState<number>(() => {
    const until = getLockUntil();
    return until ? Math.max(0, until - Date.now()) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (remaining <= 0) {
      clearLockUntil();
      return;
    }
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1_000;
        if (next <= 0) clearLockUntil();
        return Math.max(0, next);
      });
    }, 1_000);
    return () => clearInterval(timerRef.current!);
  }, [remaining]);

  const form = useForm<LoginPayloadType>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (payload: LoginPayloadType) => login(payload, domain),
    onSuccess: async (res) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEY.USER.MY,
        queryFn: getMyInfo,
      });
      await queryClient.refetchQueries({
        queryKey: QUERY_KEY.USER.MY,
        type: "all",
      });
      toast.success(res.data.msg ?? "로그인 성공");
      navigate("/");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        const msg: string | undefined = err.response?.data?.msg;
        if (msg?.includes("로그인 시도 횟수가 초과")) {
          const until = Date.now() + LOCK_DURATION_MS;
          setLockUntil(until);
          setRemaining(LOCK_DURATION_MS);
        }
        toast.error(msg ?? "로그인에 실패하였습니다.");
      } else {
        toast.error("로그인에 실패하였습니다.");
      }
    },
  });

  const handleSubmit = useCallback(
    (data: LoginPayloadType) => loginMutate(data),
    [loginMutate]
  );

  const format = (ms: number) => {
    const sec = Math.ceil(ms / 1_000);
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLocked = remaining > 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  disabled={isLocked}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  disabled={isLocked}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isLocked}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "로그인"}
        </Button>

        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-md bg-destructive/10 p-4 text-center text-sm text-destructive"
          >
            로그인이 잠겨 있습니다. <br />
            {format(remaining)} 후 다시 시도해주세요.
          </motion.div>
        )}

        <div className="flex items-center gap-4 justify-end">
          <span className="text-sm">SSE 로그인 (개발용)</span>
          <Switch
            checked={!!domain}
            onCheckedChange={() => setDomain("ticketone.site")}
          />
        </div>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" disabled={isLocked} />
          <OAuthButton provider="google" disabled={isLocked} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link to="/auth?mode=signup" className="font-medium text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </Form>
  );
};
