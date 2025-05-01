import { z } from "zod";
import { apiResponse } from "./common.schema";

/** 회원가입 */
export const signupPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  age: z.number(),
  sex: z.string(),
  phoneNum: z.string(),
  location: z.string(),
});
export type SignupPayloadType = z.infer<typeof signupPayloadSchema>;

export const signupResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
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
  email: z.string().email(),
  password: z.string(),
});
export type LoginPayloadSchema = z.infer<typeof loginPayloadSchema>;
