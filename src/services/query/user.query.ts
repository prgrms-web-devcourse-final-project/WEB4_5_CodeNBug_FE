import { QUERY_KEY } from "@/lib/query/query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyInfo,
  getMyPurchasesDetail,
  getMyPurchasesList,
  refund,
  updateMyInfo,
} from "../user.service";
import { ManagerRefundPayload } from "../manager.service";

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

export const useMyPurchases = (page = 0) =>
  useQuery({
    queryKey: QUERY_KEY.USER.PURCHASE.MY_LIST(page),
    queryFn: () => getMyPurchasesList(page),
    select: ({ data }) => data.data,
  });

export const useMyPurchase = (purchaseId: number | null) =>
  useQuery({
    enabled: purchaseId !== null,
    queryKey: QUERY_KEY.USER.PURCHASE.DETAIL(purchaseId),
    queryFn: () => getMyPurchasesDetail(purchaseId!),
    select: (res) => res.data.data?.purchases[0] ?? null,
  });

export const useRefund = (purchaseId: number | null, page: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ManagerRefundPayload) => {
      if (purchaseId === null) {
        return Promise.reject(new Error("purchaseId is null"));
      }
      return refund(purchaseId, payload);
    },

    onSuccess: () => {
      if (purchaseId !== null) {
        qc.invalidateQueries({
          queryKey: QUERY_KEY.USER.PURCHASE.DETAIL(purchaseId),
          type: "all",
        });
      }
      qc.invalidateQueries({
        queryKey: QUERY_KEY.USER.PURCHASE.MY_LIST(page),
        type: "all",
      });
    },
  });
};
