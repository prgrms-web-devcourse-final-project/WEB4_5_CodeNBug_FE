import {
  CreateEventPayload,
  ResManagerEvents,
  UpdateEventPayload,
  ResManagerEvent,
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
