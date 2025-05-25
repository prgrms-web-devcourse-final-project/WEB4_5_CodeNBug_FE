import {
  LoginPayloadType,
  ResLoginType,
  ResSignupType,
  SignupPayloadType,
  SocialLoginType,
} from "@/schemas/auth.schema";
import { axiosInstance } from "./api";
import { ApiResponse } from "@/schemas/common.schema";
import axios from "axios";

export const signup = async (payload: SignupPayloadType) => {
  return await axiosInstance.post<ResSignupType>("/users/signup", {
    ...payload,
    age: +payload.age,
  });
};

export const login = async (payload: LoginPayloadType, domain?: string) => {
  return await axiosInstance.post<ResLoginType>("/users/login", payload, {
    params: {
      domain,
    },
  });
};

export const logout = async () => {
  return await axiosInstance.post<ApiResponse>("/users/logout");
};

export const sendEmail = async (mail: string) => {
  return await axiosInstance.post<ApiResponse>("/email/send", { mail });
};

export const verifyEmail = async (mail: string, verifyCode: string) => {
  return await axiosInstance.post<ApiResponse>("/email/verify", {
    mail,
    verifyCode,
  });
};

export const getCallback = async (
  socialLoginType: "kakao" | "google",
  code: string
) => {
  return await axios.get(
    `${
      import.meta.env.MODE === "development"
        ? "/auth-api"
        : import.meta.env.VITE_SERVER_URL
    }/auth/${socialLoginType}/callback`,
    {
      params: {
        code,
        redirectUrl: import.meta.env.VITE_CLIENT_URL,
      },
    }
  );
};

export const socialLogin = async (
  socialId: string,
  payload: SocialLoginType
) => {
  return await axios.post(
    `${
      import.meta.env.MODE === "development"
        ? "/auth-api"
        : import.meta.env.VITE_SERVER_URL
    }/auth/sns/additional-info/${socialId}`,
    payload
  );
};

export const refreshAuth = async () => {
  return await axiosInstance.post("/auth/refresh");
};

export const getOAuthInfo = async (
  provider: "google" | "kakao",
  code: string | null
) =>
  await axios.get(
    `${
      import.meta.env.MODE === "development"
        ? "/auth-api"
        : import.meta.env.VITE_SERVER_URL
    }/auth/${provider}/callback`,
    {
      withCredentials: true,
      params: {
        code,
        redirectUrl: `${
          import.meta.env.VITE_CLIENT_URL
        }/auth/${provider}/callback`,
      },
    }
  );
