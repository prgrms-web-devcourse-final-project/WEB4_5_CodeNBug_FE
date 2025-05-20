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

export const pageSchema = z.object({
  size: z.number().positive(),
  number: z.number().positive(),
  totalElements: z.number().positive(),
  totalPages: z.number().positive(),
});
export type PageSchemaType = z.infer<typeof pageSchema>;
