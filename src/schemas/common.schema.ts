import { z, ZodTypeAny, ZodUnknown } from "zod";

export const apiResponse = <S extends ZodTypeAny = ZodUnknown>(
  schema: S = z.unknown() as unknown as S
) =>
  z.object({
    code: z.string(),
    data: schema.optional(),
    msg: z.string().optional(),
  });

export type ApiResponse<S extends ZodTypeAny = ZodUnknown> = z.infer<
  ReturnType<typeof apiResponse<S>>
>;
