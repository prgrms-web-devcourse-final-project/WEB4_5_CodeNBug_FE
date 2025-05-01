import { z, ZodTypeAny } from "zod";

export const apiSuccess = <S extends ZodTypeAny>(data: S) =>
  z.object({
    code: z.string(),
    data,
    msg: z.string().optional(),
  });

export const apiFail = z.object({
  code: z.string(),
  msg: z.string(),
});

export const apiResponse = <S extends ZodTypeAny>(schema: S) =>
  z.union([apiSuccess(schema), apiFail]);

export type ApiResponse<T extends ZodTypeAny> = z.infer<
  ReturnType<typeof apiResponse<T>>
>;
