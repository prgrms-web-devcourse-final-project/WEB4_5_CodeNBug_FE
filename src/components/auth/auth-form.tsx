import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OAuthButton } from "./oauth-button";

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

type Mode = "signup" | "login";

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const submitText = mode === "login" ? "로그인" : "회원가입";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          // TODO: send to API
          console.log(mode, data);
        })}
        className="mt-6 space-y-4"
      >
        {mode === "signup" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "이메일은 필수입니다" }}
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
          rules={{ required: "비밀번호는 필수입니다" }}
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
          {submitText}
        </Button>
        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" href={"OAUTH_ENDPOINTS.kakao"} />
          <OAuthButton provider="google" href={"OAUTH_ENDPOINTS.google"} />
        </div>
        {mode === "login" ? (
          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link to="/auth?mode=signup" className="font-medium text-primary">
              회원가입
            </Link>
          </p>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link to="/auth?mode=login" className="font-medium text-primary">
              로그인
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};
