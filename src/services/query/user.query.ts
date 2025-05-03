import { QUERY_KEY } from "@/lib/query/query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../user.service";
import { getMyInfoResponseSchema } from "@/schemas/user.schema";
import { z } from "zod";
import { isSuccess } from "@/lib/response";

type MyInfo = z.infer<typeof getMyInfoResponseSchema>;

export const useMyInfo = () =>
  useQuery({
    queryKey: QUERY_KEY.USER.MY,
    queryFn: getMyInfo,
    select: ({ data }): MyInfo | undefined => {
      if (isSuccess<typeof getMyInfoResponseSchema>(data)) {
        return data.data;
      }
      return undefined;
    },
  });

export const useUpdateMyInfo = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.USER.MY });
    },
  });
};
