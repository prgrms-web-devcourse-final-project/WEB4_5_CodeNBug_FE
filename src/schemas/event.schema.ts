import { z } from "zod";
import { apiResponse, pageSchema } from "./common.schema";

export const EventCategoryEnum = z.enum([
  "CONCERT",
  "MUSICAL",
  "EXHIBITION",
  "SPORTS",
  "FAN_MEETING",
  "ETC",
]);
export type EventCategory = z.infer<typeof EventCategoryEnum>;

export const EventStatusEnum = z.enum([
  "OPEN",
  "SOLD_OUT",
  "CLOSED",
  "CANCELLED",
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const EventInfoLiteSchema = z.object({
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
export type EventInfoLite = z.infer<typeof EventInfoLiteSchema>;

export const EventListItemSchema = z.object({
  eventId: z.number().int().positive(),
  category: EventCategoryEnum,
  information: EventInfoLiteSchema,

  bookingStart: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  bookingEnd: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),

  viewCount: z.number().int().nonnegative(),
  status: EventStatusEnum.default("OPEN"),

  seatSelectable: z.boolean(),
  isDeleted: z.boolean(),

  minPrice: z.number().int().nonnegative().nullable(),
  maxPrice: z.number().int().nonnegative().nullable(),
});
export type EventListItem = z.infer<typeof EventListItemSchema>;

export const EventsSchema = z.array(EventListItemSchema);
export type Events = z.infer<typeof EventsSchema>;
export const ResEventsSchema = apiResponse(
  z.object({ content: EventsSchema, page: pageSchema })
);
export type ResEvents = z.infer<typeof ResEventsSchema>;

const LayoutGradeSchema = z.object({ grade: z.string().min(1) });
export const SeatGridSchema = z.object({
  layout: z.array(z.array(z.string())),
  seat: z.record(z.string(), LayoutGradeSchema),
});

export const SeatGradeSchema = z.object({
  id: z.number().int().positive(),
  grade: z.string().min(1),
  amount: z.number().int().nonnegative(),
});
export type SeatGradeType = z.infer<typeof SeatGradeSchema>;

export const PriceSchema = SeatGradeSchema;
export type Price = z.infer<typeof PriceSchema>;
export const SeatSchema = z.object({
  id: z.number().int().positive(),
  location: z.string().min(1),
  available: z.boolean(),
  grade: SeatGradeSchema,
});

export const SeatLayoutSchema = z.object({
  id: z.number().int().positive(),
  layout: SeatGridSchema,
  seats: z.array(SeatSchema),
});

export const EventInfoDetailSchema = EventInfoLiteSchema.extend({
  description: z.string().min(1),
  restrictions: z.string().optional().default(""),
  location: z.string().min(1),
  seatCount: z.number().int().nonnegative(),
});
export type EventInfoDetail = z.infer<typeof EventInfoDetailSchema>;

export const EventDetailSchema = z.object({
  seatLayout: SeatLayoutSchema,

  eventId: z.number().int().positive(),
  category: EventCategoryEnum,
  information: EventInfoDetailSchema,

  bookingStart: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  bookingEnd: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),

  viewCount: z.number().int().nonnegative(),
  status: EventStatusEnum.default("OPEN"),

  createdAt: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  modifiedAt: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),

  prices: z.array(PriceSchema),

  seatSelectable: z.boolean(),
  isDeleted: z.boolean(),
});
export type EventDetail = z.infer<typeof EventDetailSchema>;

export const ResEventSchema = apiResponse(EventDetailSchema);
export type ResEvent = z.infer<typeof ResEventSchema>;

export const ResEventCategories = apiResponse(EventCategoryEnum);
export type ResEventCategoriesType = z.infer<typeof ResEventCategories>;
