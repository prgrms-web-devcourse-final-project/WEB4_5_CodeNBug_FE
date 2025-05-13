import { z } from "zod";
import { SeatGrade } from "./seat.schema";
import { apiResponse } from "./common.schema";

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
