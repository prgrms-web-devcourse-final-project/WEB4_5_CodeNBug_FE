import { ResSignupType, SignupPayloadType } from "@/schemas/auth.schema";
import { axiosInstance } from "./api";

export const signup = async (payload: SignupPayloadType) => {
  return await axiosInstance.post<ResSignupType>("/users/signup", {
    ...payload,
    age: +payload.age,
  });
};
