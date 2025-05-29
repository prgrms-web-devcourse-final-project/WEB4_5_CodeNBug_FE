import { z } from "zod";
import { apiResponse } from "./common.schema";
import { EventCategoryEnum, EventStatusEnum } from "./event.schema";
import { SeatGrade } from "./seat.schema";

const LayoutMatrixSchema = z
  .array(z.array(z.string().min(1).nullable()).min(1))
  .min(1);

const SeatRecordSchema = z.record(
  z.object({
    grade: SeatGrade,
  })
);

export const LayoutSchema = z
  .object({
    layout: LayoutMatrixSchema,
    seat: SeatRecordSchema,
  })
  .superRefine((data, ctx) => {
    const widths = data.layout.map((r) => r.length);
    const first = widths[0];
    const notRect = widths.some((w) => w !== first);
    if (notRect) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "모든 행(row)의 길이가 같아야 합니다.",
        path: ["layout"],
      });
    }
  });
export type Layout = z.infer<typeof LayoutSchema>;

export const ResLayoutSchema = apiResponse(
  z.object({
    layout: LayoutMatrixSchema,
  })
);
export type ResLayoutSchemaType = z.infer<typeof ResLayoutSchema>;

export const PriceSchema = z.object({
  grade: SeatGrade,
  amount: z.string(),
});
export type Price = z.infer<typeof PriceSchema>;

const BaseEventSchema = z.object({
  title: z.string().min(1),
  category: EventCategoryEnum,
  description: z.string().min(1),
  thumbnailUrl: z.string().url(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1),
  hallName: z.string().min(1),
  seatCount: z.number().int().positive(),
  layout: LayoutSchema,
  price: z.array(PriceSchema).nonempty(),
  bookingStart: z.date(),
  bookingEnd: z.date(),
  agelimit: z.number().int().nonnegative().optional(),
});

const withCrossChecks = <S extends z.ZodTypeAny>(schema: S) =>
  schema.superRefine((data: z.infer<S>, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.startDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "시작 날짜는 오늘(포함) 이후여야 합니다.",
        path: ["startDate"],
      });
    }
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "종료 날짜는 시작 날짜 이후여야 합니다.",
        path: ["endDate"],
      });
    }

    if (data.bookingStart < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "예매 시작은 오늘(포함) 이후여야 합니다.",
        path: ["bookingStart"],
      });
    }
    if (data.bookingEnd < data.bookingStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "예매 종료는 예매 시작 이후여야 합니다.",
        path: ["bookingEnd"],
      });
    }
    const rows = data.layout.layout.length;
    const cols = data.layout.layout[0].length;
    if (rows * cols > data.seatCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `좌석 매트릭스(${rows}×${cols} = ${
          rows * cols
        }석)가 총 좌석 수(${data.seatCount}석)를 초과합니다.`,
        path: ["layout"],
      });
    }
  });

export const CreateEventPayloadSchema = withCrossChecks(BaseEventSchema);

export const UpdateEventPayloadSchema = withCrossChecks(
  BaseEventSchema.partial().extend({
    eventId: z.number().int().positive(),
  })
);
type UnwrapEffects<T extends z.ZodTypeAny> = T extends z.ZodEffects<infer Inner>
  ? z.infer<Inner>
  : z.infer<T>;

export type CreateEventPayload = UnwrapEffects<typeof CreateEventPayloadSchema>;
export type UpdateEventPayload = UnwrapEffects<typeof UpdateEventPayloadSchema>;

export const DeleteEventPayloadSchema = z.object({
  eventId: z.number().int().positive(),
});
export type DeleteEventPayload = z.infer<typeof DeleteEventPayloadSchema>;

export const ManagerEventSchema = z.object({
  eventId: z.number().int().positive(),
  title: z.string().min(1),
  category: EventCategoryEnum,
  thumbnailUrl: z.string().url(),
  status: EventStatusEnum,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().min(1),
  hallName: z.string().min(1),
  isDeleted: z.boolean(),
  bookingStart: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  bookingEnd: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
});
export type ManagerEvent = z.infer<typeof ManagerEventSchema>;
export const ResManagerEventSchema = apiResponse(ManagerEventSchema);
export type ResManagerEvent = z.infer<typeof ResManagerEventSchema>;
export const ResManagerEventsSchema = apiResponse(z.array(ManagerEventSchema));
export type ResManagerEvents = z.infer<typeof ResManagerEventsSchema>;

export const ManagerPurchaseItemSchema = z
  .object({
    purchaseId: z.number(),
    userId: z.number(),
    userName: z.string(),
    userEmail: z.string().email(),
    phoneNum: z.string(),

    payment_status: z.enum([
      "DONE",
      "PENDING",
      "CANCELLED",
      "REFUND_REQUEST",
      "REFUNDED",
    ]),
    ticket_id: z.array(z.number()),

    purchaseAt: z.string().datetime(),
    amount: z.number(),
  })
  .transform((v) => ({
    ...v,
    paymentStatus: v.payment_status,
    ticketIds: v.ticket_id,
  }));

export type ManagerPurchaseItem = z.infer<typeof ManagerPurchaseItemSchema>;
export const ManagerPurchasesSchema = apiResponse(
  z.array(ManagerPurchaseItemSchema)
);
export type ResPurchasesListType = z.infer<typeof ManagerPurchasesSchema>;
