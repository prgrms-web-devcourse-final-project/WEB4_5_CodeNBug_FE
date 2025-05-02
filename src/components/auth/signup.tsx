"use client";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { OAuthButton } from "./oauth-button";
import { Link, useNavigate } from "react-router";
import { signupPayloadSchema, SignupPayloadType } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/auth.service";
import { useCallback } from "react";
import { formatPhone } from "@/lib/utils";
import { toast } from "sonner";

export const SignupForm = () => {
  const router = useNavigate();

  const form = useForm<SignupPayloadType>({
    resolver: zodResolver(signupPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      age: "",
      sex: "",
      phoneNum: "",
      location: "",
    } as unknown as SignupPayloadType,
  });

  const { mutate: signupMutation } = useMutation({
    mutationFn: (payload: SignupPayloadType) => signup(payload),
    onSuccess: (res) => {
      toast.success(res.data.msg ?? "회원가입 성공");
      form.reset();
      router("/auth?mode=login");
    },
    onError: (err) => {
      console.error(err);
      toast.error("회원가입에 실패하였습니다.");
    },
  });

  const handleSubmit = (data: SignupPayloadType) => signupMutation(data);

  const handleNumericChange = useCallback(
    (onChange: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value.replace(/\D/g, ""));
      },
    []
  );

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
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="25"
                  {...field}
                  onChange={handleNumericChange(field.onChange)}
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
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="남">
                    남
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="여">
                    여
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="기타">
                    기타
                  </SelectItem>
                </SelectContent>
              </Select>
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
                <Input
                  placeholder="010-1234-5678"
                  {...field}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                />
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
          <OAuthButton provider="kakao" />
          <OAuthButton provider="google" />
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
