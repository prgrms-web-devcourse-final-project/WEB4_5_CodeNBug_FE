import {
  type CreateNotificationPayload,
  type Notification,
} from "@/schemas/notification.schema";
import { axiosInstance, BASE } from "./api";
import { fetchSession } from "./fetch-session";
export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Paged<T> {
  code: string;
  msg: string;
  data: { content: T[]; page: PageMeta };
}

export const fetchUnreadNotifications = async () => {
  const res = await axiosInstance.get<Paged<Notification>>(
    "/notifications/unread"
  );

  return res.data.data.content;
};

export const fetchAllNotifications = async () => {
  const res = await axiosInstance.get<Paged<Notification>>("/notifications");
  return res.data.data.content;
};

export const fetchNotification = async (id: number) => {
  const res = await axiosInstance.get<Notification>(`/notifications/${id}`);
  return res.data;
};

export const createNotification = async (p: CreateNotificationPayload) =>
  await axiosInstance.post<Notification>("/notifications", p);

export const deleteNotification = async (id: number) =>
  await axiosInstance.delete(`/notifications/${id}`);
export const deleteNotifications = async (notificationIds: number[]) =>
  await axiosInstance.post(`/notifications`, { notificationIds });
export const deleteAllNotifications = async () =>
  await axiosInstance.delete(`/notifications/all`);

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

    es = new EventSource(`${BASE}/notifications/subscribe`, {
      withCredentials: true,
    });

    es.addEventListener("message", (e) => handleEvent(e as MessageEvent));

    es.addEventListener("notification", (e) =>
      handleEvent(e as MessageEvent<string>)
    );

    es.onerror = (evt: Event) => {
      onError?.(evt);
      cleanup();
      scheduleReconnect();
    };
  };

  const handleEvent = (e: MessageEvent<string>) => {
    if (!e.data || e.data === ".") return;
    try {
      const parsed = JSON.parse(e.data);
      onMessage(parsed);
    } catch (err) {
      console.error("알림 파싱 실패", err);
    }
  };

  connect();

  return cleanup;
};
