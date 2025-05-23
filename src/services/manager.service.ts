import {
  CreateEventPayload,
  ResManagerEvents,
  UpdateEventPayload,
  ResManagerEvent,
  ResPurchasesListType,
} from "@/schemas/manager.schema";
import { axiosInstance } from "./api";
import { ApiResponse } from "@/schemas/common.schema";

export const createManagerEvent = async (payload: CreateEventPayload) =>
  axiosInstance.post<ResManagerEvent>("/manager/events", payload);

export const updateManagerEvent = async (
  eventId: string,
  payload: UpdateEventPayload
) => axiosInstance.put<ResManagerEvent>(`/manager/events/${eventId}`, payload);

export const deleteManagerEvent = async (eventId: string) =>
  axiosInstance.patch<ApiResponse>(`/manager/events/${eventId}`);

export const getManagerEvents = async () =>
  axiosInstance.get<ResManagerEvents>("/manager/events/me");

export const getImageUrl = async (fileNames: string[]) => {
  return await axiosInstance.post<{
    data: { fileName: string; url: string }[];
  }>("/images/url", {
    fileNames,
  });
};

export const getManagerPurchasesList = (eventId: number) =>
  axiosInstance.get<ResPurchasesListType>(
    `/manager/events/${eventId}/purchases`
  );

export interface ManagerRefundPayload {
  purchasesIds: number[];
  totalRefund: boolean;
  reason: string;
}

export const managerRefund = (
  purchaseId: number,
  payload: ManagerRefundPayload
) =>
  axiosInstance.post(`/manager/events/${purchaseId}/purchases/refund`, payload);
