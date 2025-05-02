import {
  LoginPayloadType,
  ResLoginType,
  ResSignupType,
  SignupPayloadType,
} from "@/schemas/auth.schema";
import { axiosInstance } from "./api";
import { ApiResponse } from "@/schemas/common.schema";

export const signup = async (payload: SignupPayloadType) => {
  return await axiosInstance.post<ResSignupType>("/users/signup", {
    ...payload,
    age: +payload.age,
  });
};

export const login = async (payload: LoginPayloadType) => {
  return await axiosInstance.post<ResLoginType>("/users/login", payload);
};

export const logout = async () => {
  return await axiosInstance.post<ApiResponse>("/users/logout");
};
