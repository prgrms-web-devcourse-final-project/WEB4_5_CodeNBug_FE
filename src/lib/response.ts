import { apiFail, ApiResponse, apiSuccess } from "@/schemas/common.schema";
import { z, ZodTypeAny } from "zod";

export type Success<S extends ZodTypeAny = z.ZodUnknown> = z.infer<
  ReturnType<typeof apiSuccess<S>>
>;

export type Fail = z.infer<typeof apiFail>;

export const isSuccess = <S extends ZodTypeAny>(
  res: ApiResponse<S>
): res is Success<S> & { data: z.infer<S> } =>
  "data" in res && res.data !== undefined;
