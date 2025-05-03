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
