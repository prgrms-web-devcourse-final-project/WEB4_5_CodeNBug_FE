import { z, ZodTypeAny } from "zod";

export const apiSuccess = <S extends ZodTypeAny = z.ZodUnknown>(schema?: S) =>
  z.object({
    code: z.string(),
    data: (schema ?? z.unknown()).optional(),
    msg: z.string().optional(),
  });

export const apiFail = z.object({
  code: z.string(),
  msg: z.string(),
});

export const apiResponse = <S extends ZodTypeAny = z.ZodUnknown>(schema?: S) =>
  z.union([apiSuccess(schema), apiFail]);

export type ApiResponse<S extends ZodTypeAny = z.ZodUnknown> = z.infer<
  ReturnType<typeof apiResponse<S>>
>;
