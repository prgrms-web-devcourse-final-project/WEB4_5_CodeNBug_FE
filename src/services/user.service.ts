import { MyInfoType, ResMyInfoType } from "@/schemas/user.schema";
import { axiosInstance } from "./api";

export const getMyInfo = async () => {
  return await axiosInstance.get<ResMyInfoType>("/users/me");
};

export const updateMyInfo = async (payload: Partial<MyInfoType>) => {
  return await axiosInstance.put<ResMyInfoType>("/users/me", payload);
};
