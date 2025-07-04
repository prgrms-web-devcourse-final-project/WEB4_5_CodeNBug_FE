import { ResSeatLayoutSchemaType } from "@/schemas/layout.schema";
import { axiosInstance } from "./api";
import { ResSetSeatSchemaType } from "@/schemas/seat.schema";

export const getSeats = async (eventId: string) => {
  return await axiosInstance.get<ResSeatLayoutSchemaType>(
    `/event/${eventId}/seats`
  );
};

export const setSeat = async (eventId: string) => {
  return await axiosInstance.post<ResSetSeatSchemaType>(
    `/event/${eventId}/seats`
  );
};
