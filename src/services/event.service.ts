import {
  ResAvailableSeatSchemaType,
  ResEventCategoriesType,
  ResEventsType,
  ResEventType,
} from "@/schemas/event.schema";
import { axiosInstance } from "./api";

export const getAllEvents = async () => {
  return await axiosInstance.post<ResEventsType>("/events");
};

export const getEvent = async (eventId: string) => {
  return await axiosInstance.get<ResEventType>(`/events/${eventId}`);
};

export const getEventCategory = async () => {
  return await axiosInstance.get<ResEventCategoriesType>("/event-types");
};

export const getAvailableSeat = async (evnetId: string) => {
  return await axiosInstance.get<ResAvailableSeatSchemaType>(
    `/events/${evnetId}/seats`
  );
};
