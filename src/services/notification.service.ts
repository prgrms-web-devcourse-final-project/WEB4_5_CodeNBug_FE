import type { Notification } from "@/schemas/notification.schema";
import { axiosInstance, BASE } from "./api";
import { fetchSession } from "./fetch-session";

export const fetchAllNotifications = () =>
  axiosInstance.get<Notification[]>("/api/v1/notifications");

export const fetchUnreadNotifications = () =>
  axiosInstance.get<Notification[]>("/api/v1/notifications/unread");

export const fetchNotification = (id: number) =>
  axiosInstance.get<Notification>(`/api/v1/notifications/${id}`);

export const markNotificationRead = (id: number) =>
  axiosInstance.patch(`/api/v1/notifications/${id}`, { isRead: true });

type EventHandler = (n: Notification) => void;
type ErrorHandler = (err: unknown) => void;

const MAX_RETRY = 5;

export const subscribeNotifications = (
  onMessage: EventHandler,
  onError?: ErrorHandler
) => {
  let es: EventSource | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let retry = 0;

  const cleanup = () => {
    es?.close();
    es = null;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  const scheduleReconnect = () => {
    if (retry >= MAX_RETRY) return;
    retry += 1;
    const base = Math.min(30_000, 2 ** (retry - 1) * 1_000);
    const delay = base * (0.75 + Math.random() * 0.5);
    timeoutId = setTimeout(connect, delay);
  };

  const connect = async () => {
    try {
      const me = await fetchSession();
      if (!me) return;
    } catch (err) {
      onError?.(err);
      scheduleReconnect();
      return;
    }

    es = new EventSource(`${BASE}/api/v1/notifications/subscribe`, {
      withCredentials: true,
    });

    es.onopen = () => (retry = 0);

    es.onmessage = ({ data, lastEventId }) => {
      if (data && data !== ".") {
        try {
          onMessage(JSON.parse(data) as Notification);
        } catch {
          /*  */
        }
      }
      if (lastEventId) localStorage.setItem("lastEventId", lastEventId);
    };

    es.onerror = (evt: Event) => {
      onError?.(evt);
      cleanup();
      scheduleReconnect();
    };
  };

  // connect();

  return cleanup;
};
