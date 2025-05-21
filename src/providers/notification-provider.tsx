import { ReactNode, createContext, useContext, useEffect } from "react";
// import { toast } from "sonner";
import { Notification } from "@/schemas/notification.schema";
import { useMyInfo } from "@/services/query/user.query";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/services/query/notification.query";
import { subscribeNotifications } from "@/services/notification.service";
import { QUERY_KEY } from "@/lib/query/query-key";

type Ctx = {
  list: Notification[];
  markRead: (id: number) => void;
};
const NotificationContext = createContext<Ctx | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { data: me } = useMyInfo();
  const userId = me?.id ?? -1;

  const { data: list = [] } = useNotifications(userId);

  const qc = useQueryClient();
  useEffect(() => {
    if (userId === -1) return;

    const unsubscribe = subscribeNotifications((n) => {
      qc.setQueryData<Notification[]>(
        QUERY_KEY.NOTIFICATION.ALL(userId),
        (prev = []) => (prev.some((x) => x.id === n.id) ? prev : [n, ...prev])
      );
      // if (!n.isRead) toast.info(n.title);
    });

    return unsubscribe;
  }, [userId, qc]);

  const markRead = (id: number) => {
    qc.setQueryData<Notification[]>(
      QUERY_KEY.NOTIFICATION.ALL(userId),
      (prev = []) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <NotificationContext.Provider value={{ list, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStore = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationProvider 안에서 사용하세요");
  return ctx;
};
