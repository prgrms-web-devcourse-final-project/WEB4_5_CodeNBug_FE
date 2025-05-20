type EntryPayload = {
  eventId: number;
  userId: number;
  token: string;
  status: "IN_ENTRY" | "IN_PROGRESS" | "EXPIRED";
};

type SubscribeOptions = {
  onError?: (err: Error) => void;
};

export const subscribeWaitingTickets = (
  eventId: string,
  cb: (payload: EntryPayload) => void,
  {
    onError,
    onHeartbeat,
    maxRetry = 5,
  }: SubscribeOptions & {
    onHeartbeat?: () => void;
    maxRetry?: number;
  } = {}
) => {
  const url = `/sse/api/v1/events/${eventId}/tickets/waiting`;

  let es: EventSource | null = null;
  let retryCount = 0;

  const connect = () => {
    es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      retryCount = 0;
      console.info("SSE 연결 완료");
    };

    es.onmessage = (e) => {
      if (e.data === ".") {
        onHeartbeat?.();
        return;
      }

      try {
        const payload: EntryPayload = JSON.parse(e.data);
        cb(payload);
      } catch (err) {
        console.warn("SSE payload parse error:", err);
      }
    };

    es.onerror = () => {
      console.error("SSE error: 연결이 끊어졌습니다.");
      es?.close();

      if (retryCount < maxRetry) {
        const delay = 2 ** retryCount * 1000;
        retryCount += 1;
        setTimeout(connect, delay);
      } else {
        onError?.(new Error("실시간 대기열 서버와 연결할 수 없습니다."));
      }
    };
  };

  connect();

  return () => {
    es?.close();
    es = null;
  };
};
