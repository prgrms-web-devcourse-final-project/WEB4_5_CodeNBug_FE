import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query/query-key";
import {
  getManagerPurchasesList,
  managerRefund,
  ManagerRefundPayload,
} from "../manager.service";

export const useManagerPurchases = (eventId: number | null) =>
  useQuery({
    enabled: eventId !== null,
    queryKey: QUERY_KEY.MANAGER.PURCHASE_LIST(eventId),
    queryFn: () => getManagerPurchasesList(eventId!),
    staleTime: Infinity,
    select: (res) => res.data.data,
  });

export const useManagerRefund = (eventId: number, purchaseId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (p: ManagerRefundPayload) => managerRefund(purchaseId, p),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEY.MANAGER.PURCHASE_LIST(eventId),
      });
    },
  });
};
