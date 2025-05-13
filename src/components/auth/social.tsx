import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { socialLoginSchema, SocialLoginType } from "@/schemas/auth.schema";
import { socialLogin } from "@/services/auth.service";
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
import { Separator } from "../ui/separator";
import { OAuthButton } from "./oauth-button";

export const SocialForm = ({ code }: { code: string | null }) => {
  const router = useNavigate();

  const form = useForm<SocialLoginType>({
    resolver: zodResolver(socialLoginSchema),
    defaultValues: {
      age: "",
      sex: "",
      phoneNum: "",
      location: "",
    } as unknown as SocialLoginType,
  });

  const { mutate: socialLoginMut, isPending: signingUp } = useMutation({
    mutationFn: (payload: SocialLoginType) => socialLogin(code ?? "", payload),
    onSuccess: (res) => {
      toast.success(res.data.msg ?? "소셜 로그인 성공");
      form.reset();
      router("/");
    },
    onError: () => toast.error("소셜 로그인에 실패했습니다."),
  });

  const handleSubmit = (data: SocialLoginType) => socialLoginMut(data);

  const handleNumericChange = useCallback(
    (onChange: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value.replace(/\D/g, "")),
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

        <Button type="submit" className="w-full" disabled={signingUp}>
          {signingUp ? <Loader2 className="size-4 animate-spin" /> : "회원가입"}
        </Button>

        <div className="space-y-4 pt-4">
          <Separator />
          <OAuthButton provider="kakao" />
          <OAuthButton provider="google" />
        </div>
      </form>
    </Form>
  );
};
