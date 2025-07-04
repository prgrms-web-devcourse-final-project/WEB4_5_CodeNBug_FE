import { z } from "zod";
import { apiResponse } from "./common.schema";

/** 회원가입 */
export const signupPayloadSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: "이메일은 필수 입력 항목입니다." })
      .email({ message: "유효한 이메일 형식이 아닙니다." }),

    password: z
      .string()
      .nonempty({ message: "비밀번호는 필수 입력 항목입니다." }),
    passwordConfirm: z
      .string()
      .nonempty({ message: "비밀번호 확인은 필수 입력 항목입니다." }),

    name: z.string().nonempty({ message: "이름은 필수 입력 항목입니다." }),

    age: z.string().regex(/^\d+$/, { message: "나이는 숫자만 입력해주세요." }),

    sex: z.string().nonempty({ message: "성별은 필수 입력 항목입니다." }),

    phoneNum: z
      .string()
      .nonempty({ message: "전화번호는 필수 입력 항목입니다." })
      .regex(/^\d{3}-\d{3,4}-\d{4}$/, {
        message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
      }),

    location: z.string().nonempty({ message: "주소는 필수 입력 항목입니다." }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignupPayloadType = z.infer<typeof signupPayloadSchema>;

export const signupResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  age: z.number(),
  sex: z.string(),
  phoneNum: z.string(),
  location: z.string(),
  createdAt: z.string(),
});

export const ResSignup = apiResponse(signupResponseSchema);
export type ResSignupType = z.infer<typeof ResSignup>;

/** 로그인 */
export const loginPayloadSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일은 필수 입력 항목입니다." })
    .email({ message: "유효한 이메일 형식이 아닙니다." }),

  password: z
    .string()
    .nonempty({ message: "비밀번호는 필수 입력 항목입니다." }),
});
export type LoginPayloadType = z.infer<typeof loginPayloadSchema>;

export const loginResponseSchmea = z.object({
  tokenType: z.string(),
});
export const ResLogin = apiResponse(loginResponseSchmea);
export type ResLoginType = z.infer<typeof ResLogin>;

/** 소셜 로그인 */
export const socialLoginSchema = z.object({
  age: z.string().regex(/^\d+$/, { message: "나이는 숫자만 입력해주세요." }),

  sex: z.string().nonempty({ message: "성별은 필수 입력 항목입니다." }),

  phoneNum: z
    .string()
    .nonempty({ message: "전화번호는 필수 입력 항목입니다." })
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, {
      message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
    }),

  location: z.string().nonempty({ message: "주소는 필수 입력 항목입니다." }),
});
export type SocialLoginType = z.infer<typeof socialLoginSchema>;
export const ResSocialLogin = apiResponse(socialLoginSchema);
export type ResSocialLoginType = z.infer<typeof ResSocialLogin>;
