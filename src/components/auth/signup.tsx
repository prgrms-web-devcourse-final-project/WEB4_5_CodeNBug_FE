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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OAuthButton } from "./oauth-button";
import { Link } from "react-router";
import { signupPayloadSchema, SignupPayloadType } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/auth.service";

export const SignupForm = () => {
  const form = useForm<SignupPayloadType>({
    resolver: zodResolver(signupPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      age: 0,
      sex: "",
      phoneNum: "",
      location: "",
    },
  });

  const { mutate: signupMutation } = useMutation({
    mutationFn: (payload: SignupPayloadType) => signup(payload),
  });

  const handleSubmit = (data: SignupPayloadType) => {
    signupMutation(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 space-y-4"
      >
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

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>나이</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="25"
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성별</FormLabel>
              <FormControl>
                <Input placeholder="남 / 여 / 기타" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>휴대폰 번호</FormLabel>
              <FormControl>
                <Input placeholder="010-1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>거주 지역</FormLabel>
              <FormControl>
                <Input placeholder="서울" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          회원가입
        </Button>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" href={"OAUTH_ENDPOINTS.kakao"} />
          <OAuthButton provider="google" href={"OAUTH_ENDPOINTS.google"} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link to="/auth?mode=login" className="font-medium text-primary">
            로그인
          </Link>
        </p>
      </form>
    </Form>
  );
};
