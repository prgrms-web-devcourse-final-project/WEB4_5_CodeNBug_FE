import { z } from "zod";
import { apiResponse } from "./common.schema";

const PaymentStatus = z.enum(["IN_ENTRY", "IN_PROGRESS", "EXPIRED"]);

export const InitialPaymentsSchema = z.object({
  purchaseId: z.number().positive(),
  status: PaymentStatus,
});
export const ResInitialPaymentsSchema = apiResponse(InitialPaymentsSchema);
export type ResInitialPaymentsSchemaType = z.infer<
  typeof ResInitialPaymentsSchema
>;
