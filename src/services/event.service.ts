import {
  ResEvent,
  ResEventCategoriesType,
  ResEvents,
} from "@/schemas/event.schema";
import { axiosInstance } from "./api";
import { ResSetSeatApiSchemaType } from "@/schemas/seat.schema";

type CostRange = { min: number; max: number };

export const getAllEvents = async ({
  page,
  size,
  costRange,
  eventCategoryList,
}: {
  page: number;
  size: number;
  costRange: CostRange;
  eventCategoryList: string[];
}) => {
  const res = await axiosInstance.post<ResEvents>(
    `/events?page=${page}&size=${size}`,
    { costRange, eventCategoryList }
  );

  return {
    data: res.data,
    totalPages: res.data.data?.page.totalPages ?? 1,
  };
};

export const getEvent = async (eventId: string) => {
  return await axiosInstance.get<ResEvent>(`/events/${eventId}`);
};

export const getEventCategory = async () => {
  return await axiosInstance.get<ResEventCategoriesType>("/event-types");
};

export const getAvailableSeat = async (eventId: string) => {
  return await axiosInstance.get(`/events/${eventId}/seats`);
};

export const setSeat = async (
  eventId: string,
  seatList: number[],
  ticketCount: number,
  entryAuthToken: string
) => {
  return await axiosInstance.post<ResSetSeatApiSchemaType>(
    `/event/${eventId}/seats`,
    {
      seatList,
      ticketCount,
    },
    { headers: { entryAuthToken } }
  );
};
