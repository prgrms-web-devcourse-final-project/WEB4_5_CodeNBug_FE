import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllNotifications,
  fetchUnreadNotifications,
  markNotificationRead,
} from "@/services/notification.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { useCallback } from "react";

export const useNotifications = () =>
  useQuery({
    queryKey: QUERY_KEY.NOTIFICATION.ALL,
    queryFn: fetchAllNotifications,
    staleTime: 60_000,
    select: ({ data }) => data,
  });

export const useUnreadNotifications = () =>
  useQuery({
    queryKey: QUERY_KEY.NOTIFICATION.UNREAD,
    queryFn: fetchUnreadNotifications,
    staleTime: 15_000,
    select: ({ data }) => data,
  });

export const useReadNotification = () => {
  const qc = useQueryClient();
  return useCallback(
    async (id: number) => {
      await markNotificationRead(id);

      qc.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD });
      qc.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.ALL });
    },
    [qc]
  );
};
