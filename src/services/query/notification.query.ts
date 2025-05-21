import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllNotifications,
  deleteNotification,
  fetchAllNotifications,
  fetchNotification,
  fetchUnreadNotifications,
} from "@/services/notification.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { useEffect } from "react";
import { Notification } from "@/schemas/notification.schema";

export const useNotifications = (userId: number) =>
  useQuery({
    queryKey: QUERY_KEY.NOTIFICATION.ALL(userId),
    queryFn: fetchAllNotifications,
    staleTime: 60_000,
  });

export const useUnreadNotifications = (userId: number) =>
  useQuery({
    queryKey: QUERY_KEY.NOTIFICATION.UNREAD(userId),
    queryFn: fetchUnreadNotifications,
    staleTime: 15_000,
  });

export const useNotificationDetail = (userId: number, id?: number) => {
  const qc = useQueryClient();

  const query = useQuery({
    enabled: !!id,
    queryKey: QUERY_KEY.NOTIFICATION.DETAIL(userId, id ?? -1),
    queryFn: () => fetchNotification(id!),
    gcTime: 0,
  });

  useEffect(() => {
    if (!query.data) return;

    qc.setQueryData<Notification[] | undefined>(
      QUERY_KEY.NOTIFICATION.ALL(userId),
      (prev) =>
        prev?.map((n) => (n.id === query.data!.id ? { ...n, isRead: true } : n))
    );

    qc.invalidateQueries({
      queryKey: QUERY_KEY.NOTIFICATION.UNREAD(userId),
    });
  }, [query.data, qc, userId]);

  return query;
};

export const useDeleteNotification = (userId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, id) => {
      qc.setQueryData<Notification[]>(
        QUERY_KEY.NOTIFICATION.ALL(userId),
        (prev = []) => prev.filter((n) => n.id !== id)
      );
      qc.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD(userId) });
    },
  });
};

export const useDeleteAllNotifications = (userId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      qc.setQueryData(QUERY_KEY.NOTIFICATION.ALL(userId), []);
      qc.setQueryData(QUERY_KEY.NOTIFICATION.UNREAD(userId), []);
    },
  });
};
