import { z } from "zod";
import { SeatGrade } from "./seat.schema";
import { apiResponse } from "./common.schema";

export const SeatSchema = z.object({
  seatId: z.number().int().positive(),
  location: z.string().min(1),
  grade: SeatGrade,
  available: z.boolean(),
});
export type Seat = z.infer<typeof SeatSchema>;

export const LayoutMatrixSchema = z
  .array(z.array(z.string().min(1).nullable()).min(1))
  .min(1);

export const SeatLayoutSchema = z
  .object({
    seats: z.array(SeatSchema),
    layout: LayoutMatrixSchema,
  })
  .superRefine((data, ctx) => {
    const widths = data.layout.map((r) => r.length);
    const first = widths[0];
    if (widths.some((w) => w !== first)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "모든 행(row)의 길이가 같아야 합니다.",
        path: ["layout"],
      });
    }

    const locSet = new Set(data.seats.map((s) => s.location));
    data.layout.forEach((row, r) =>
      row.forEach((loc, c) => {
        if (loc && !locSet.has(loc))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `"${loc}" 좌석이 seats 배열에 없습니다.`,
            path: ["layout", r, c],
          });
      })
    );
  });

export type SeatLayout = z.infer<typeof SeatLayoutSchema>;

export const ResSeatLayoutSchema = apiResponse(SeatLayoutSchema);
export type ResSeatLayoutSchemaType = z.infer<typeof ResSeatLayoutSchema>;
