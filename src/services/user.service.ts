import { ResMyInfoType } from "@/schemas/user.schema";
import { axiosInstance } from "./api";

export const getMyInfo = async () => {
  return await axiosInstance.get<ResMyInfoType>("/users/me");
};
