import {
  MyInfoType,
  ResMyInfoType,
  ResMyPurchasesListType,
  ResPurchaseDetailType,
} from "@/schemas/user.schema";
import { axiosInstance } from "./api";
import { ManagerRefundPayload } from "./manager.service";

export const getMyInfo = async () => {
  return await axiosInstance.get<ResMyInfoType>("/users/me");
};

export const updateMyInfo = async (payload: Partial<MyInfoType>) => {
  return await axiosInstance.put<ResMyInfoType>("/users/me", payload);
};

export const getMyPurchasesList = (page = 0, size = 10) =>
  axiosInstance.get<ResMyPurchasesListType>("/users/me/purchases", {
    params: { page, size },
  });

export const getMyPurchasesDetail = (purchaseId: number) =>
  axiosInstance.get<ResPurchaseDetailType>(`/users/me/purchases/${purchaseId}`);

export const refund = async (
  purchasesId: number,
  payload: ManagerRefundPayload
) => await axiosInstance.post(`/purchases/${purchasesId}/refund`, payload);
