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
import { Link } from "react-router";
import { loginPayloadSchema, LoginPayloadSchema } from "@/schemas/auth.schema";

export const LoginForm = () => {
  const form = useForm<LoginPayloadSchema>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginPayloadSchema) => {
    console.log("login", data);
  };

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
          로그인
        </Button>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" href={"OAUTH_ENDPOINTS.kakao"} />
          <OAuthButton provider="google" href={"OAUTH_ENDPOINTS.google"} />
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
