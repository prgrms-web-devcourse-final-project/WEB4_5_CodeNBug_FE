import { z } from "zod";
import { apiResponse } from "./common.schema";

export const SeatGrade = z.enum(["VIP", "R", "S", "A", "B", "STANDING"]);
export type SeatGrade = z.infer<typeof SeatGrade>;

export const SetSeatSchema = z.object({
  seatId: z.string().array(),
});
export const ResSetSeatSchema = apiResponse(SetSeatSchema);
export type ResSetSeatSchemaType = z.infer<typeof ResSetSeatSchema>;

const SetSeatApiSchema = z.object({
  seatList: z.array(z.number()),
});
export const ResSetSeatApiSchema = apiResponse(SetSeatApiSchema);
export type ResSetSeatApiSchemaType = z.infer<typeof ResSetSeatApiSchema>;
