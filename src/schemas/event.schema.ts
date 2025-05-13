import { z } from "zod";
import { apiResponse } from "./common.schema";

export const EventStatus = z.enum(["OPEN", "CLOSED", "CANCLLED"]);
export type EventStatus = z.infer<typeof EventStatus>;

export const EventInformationSchema = z.object({
  title: z.string().min(1),
  thumbnailUrl: z.string().url(),
  ageLimit: z.number().int().nonnegative(),
  hallName: z.string().min(1),
  eventStart: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  eventEnd: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
});
export type EventInformation = z.infer<typeof EventInformationSchema>;

export const EventSchema = z.object({
  eventId: z.number().int().positive(),
  typeId: z.number().int().positive(),

  information: EventInformationSchema,

  bookingStart: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  bookingEnd: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),

  viewCount: z.number().int().nonnegative().default(0),
  status: EventStatus.default("OPEN"),

  seatSelectable: z.boolean(),
  isDeleted: z.boolean(),
});
export type Event = z.infer<typeof EventSchema>;
export const ResEventSchema = apiResponse(EventSchema);
export type ResEventType = z.infer<typeof ResEventSchema>;

export const EventsSchema = z.array(EventSchema);
export type Events = z.infer<typeof EventsSchema>;

export const ResEventsSchema = apiResponse(EventsSchema);
export type ResEventsType = z.infer<typeof ResEventsSchema>;

export const EventCategorySchema = z.object({
  typeId: z.number(),
  name: z.string(),
});
export const EventCategoriesSchema = z.array(EventCategorySchema);
export const ResEventCategoriesSchema = apiResponse(EventCategoriesSchema);
export type ResEventCategoriesType = z.infer<typeof ResEventCategoriesSchema>;

export const AvailableSeatSchema = z.object({
  available: z.number().positive(),
});
export type AvailableSeatSchemaType = z.infer<typeof AvailableSeatSchema>;
export const ResAvailableSeatSchema = apiResponse(AvailableSeatSchema);
export type ResAvailableSeatSchemaType = z.infer<typeof ResAvailableSeatSchema>;
