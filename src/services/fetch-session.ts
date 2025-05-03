import axios from "axios";
import { getMyInfo } from "@/services/user.service";
import { ResMyInfo } from "@/schemas/user.schema";

export const fetchSession = async () => {
  try {
    const { data } = await getMyInfo();

    const parsed = ResMyInfo.safeParse(data);
    if (!parsed.success || !("data" in parsed.data)) return null;

    return parsed.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    throw err;
  }
};
