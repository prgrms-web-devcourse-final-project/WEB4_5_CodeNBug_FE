import { z } from "zod";
import { apiResponse } from "./common.schema";

export const getMyInfoResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  age: z.number(),
  sex: z.string(),
  phoneNum: z.string(),
  location: z.string(),
  createdAt: z.string(),
  modifiedAt: z.string(),
  role: z.enum(["ROLE_USER", "ROLE_ADMIN", "ROLE_MANAGER"]),
});
export type MyInfoType = z.infer<typeof getMyInfoResponseSchema>;

export const ResMyInfo = apiResponse(getMyInfoResponseSchema);
export type ResMyInfoType = z.infer<typeof ResMyInfo>;

export const MyPurchasesItemSchema = z.object({
  purchaseId: z.number(),
  itemName: z.string(),
  amount: z.number(),
  purchaseDate: z.string(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
});
export type MyPurchasesItem = z.infer<typeof MyPurchasesItemSchema>;

export const PaginatedPurchasesSchema = z.object({
  currentPage: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  pageSize: z.number(),
  purchases: z.array(MyPurchasesItemSchema),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const ResMyPurchasesList = apiResponse(PaginatedPurchasesSchema);
export type ResMyPurchasesListType = z.infer<typeof ResMyPurchasesList>;

export const TicketSchema = z.object({
  ticketId: z.number(),
  seatLocation: z.string(),
});
export const PurchaseDetailItemSchema = z.object({
  purchaseId: z.number(),
  eventId: z.number(),
  itemName: z.string(),
  amount: z.number(),
  purchaseDate: z.string().datetime(),
  paymentMethod: z.string(),
  paymentStatus: z.enum(["DONE", "PENDING", "CANCELLED"]),
  tickets: z.array(TicketSchema),
});
export type PurchaseDetailItem = z.infer<typeof PurchaseDetailItemSchema>;
export const PurchaseDetailResponseSchema = apiResponse(
  z.object({
    purchases: z.array(PurchaseDetailItemSchema),
  })
);
export type ResPurchaseDetailType = z.infer<
  typeof PurchaseDetailResponseSchema
>;
