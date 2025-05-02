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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { OAuthButton } from "./oauth-button";
import { Link, useNavigate } from "react-router";
import { loginPayloadSchema, LoginPayloadType } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const router = useNavigate();

  const form = useForm<LoginPayloadType>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (payload: LoginPayloadType) => login(payload),
    onSuccess: (res) => {
      toast.success(res.data.msg ?? "회원가입 성공");
      router("/");
    },
    onError: (err) => {
      console.error(err);
      toast.error("로그인에 실패하였습니다.");
    },
  });

  const handleSubmit = (data: LoginPayloadType) => loginMutation(data);

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
                <Input type="email" placeholder="name@example.com" {...field} />
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
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "로그인"}
        </Button>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" />
          <OAuthButton provider="google" />
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
