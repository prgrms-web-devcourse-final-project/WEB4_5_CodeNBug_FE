import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MailCheck, Send } from "lucide-react";

import { signupPayloadSchema, SignupPayloadType } from "@/schemas/auth.schema";
import { sendEmail, signup, verifyEmail } from "@/services/auth.service";
import { formatPhone } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Separator } from "../ui/separator";
import { OAuthButton } from "./oauth-button";

export const SignupForm = () => {
  const router = useNavigate();
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [counter, setCounter] = useState(0);

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

  const emailValue = form.watch("email");

  const { mutate: sendEmailMut, isPending: sendingCode } = useMutation({
    mutationFn: () => sendEmail(emailValue),
    onSuccess: () => {
      toast.success("인증 메일이 전송되었습니다 ✉️");
      setEmailSent(true);
      setCounter(60);
    },
    onError: () => toast.error("메일 전송에 실패했습니다."),
  });

  const { mutate: verifyEmailMut, isPending: verifyingCode } = useMutation({
    mutationFn: () => verifyEmail(emailValue, otp),
    onSuccess: () => {
      toast.success("이메일이 인증되었습니다");
      setEmailVerified(true);
    },
    onError: () => toast.error("인증 코드가 올바르지 않습니다."),
  });

  const { mutate: signupMut, isPending: signingUp } = useMutation({
    mutationFn: (payload: SignupPayloadType) => signup(payload),
    onSuccess: (res) => {
      toast.success(res.data.msg ?? "회원가입 성공");
      form.reset();
      router("/auth?mode=login");
    },
    onError: () => toast.error("회원가입에 실패했습니다."),
  });

  const handleSubmit = (data: SignupPayloadType) => signupMut(data);

  const handleNumericChange = useCallback(
    (onChange: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value.replace(/\D/g, "")),
    []
  );

  useEffect(() => {
    if (!counter) return;
    const id = setInterval(() => setCounter((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [counter]);

  const canSendCode = useMemo(
    () => !!emailValue && !sendingCode && counter === 0,
    [emailValue, sendingCode, counter]
  );
  const canVerifyCode = useMemo(
    () => emailSent && otp.length === 6 && !emailVerified && !verifyingCode,
    [emailSent, otp, emailVerified, verifyingCode]
  );
  const canSignup = useMemo(
    () => emailVerified && !signingUp,
    [emailVerified, signingUp]
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
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canSendCode}
                  onClick={() => sendEmailMut()}
                >
                  {sendingCode ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="size-4 mr-1" />
                      {counter ? `${counter}s` : "코드 발송"}
                    </>
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {emailSent && (
          <div className="flex items-end gap-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={emailVerified}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!canVerifyCode}
              onClick={() => verifyEmailMut()}
            >
              {verifyingCode ? (
                <Loader2 className="size-4 animate-spin" />
              ) : emailVerified ? (
                <MailCheck className="size-4 text-green-600" />
              ) : (
                "코드 확인"
              )}
            </Button>
          </div>
        )}

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
                  {["남", "여", "기타"].map((v) => (
                    <SelectItem key={v} value={v} className="cursor-pointer">
                      {v}
                    </SelectItem>
                  ))}
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

        <Button type="submit" className="w-full" disabled={!canSignup}>
          {signingUp ? <Loader2 className="size-4 animate-spin" /> : "회원가입"}
        </Button>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" disabled={false} />
          <OAuthButton provider="google" disabled={false} />
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
