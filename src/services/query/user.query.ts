import { QUERY_KEY } from "@/lib/query/query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../user.service";

export const useMyInfo = () =>
  useQuery({
    queryKey: QUERY_KEY.USER.MY,
    queryFn: getMyInfo,
    select: (res) => res.data.data,
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
