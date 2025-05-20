import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { subscribeNotifications } from "@/services/notification.service";
import { toast } from "sonner";
import { Notification } from "@/schemas/notification.schema";

type Action =
  | { type: "PUSH"; payload: Notification }
  | { type: "MARK_READ"; id: number };

const NotificationContext = createContext<{
  list: Notification[];
  dispatch: React.Dispatch<Action>;
} | null>(null);

const reducer = (state: Notification[], action: Action): Notification[] => {
  switch (action.type) {
    case "PUSH":
      return [action.payload, ...state];
    case "MARK_READ":
      return state.map((n) =>
        n.id === action.id ? { ...n, isRead: true } : n
      );
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [list, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const unsubscribe = subscribeNotifications(
      (n) => {
        dispatch({ type: "PUSH", payload: n });
        if (!n.isRead) {
          toast.info(n.content);
        }
      },
      () => console.error("알림 서버와 연결이 끊어졌습니다. 재연결 시도 중…")
    );

    return unsubscribe;
  }, []);

  return (
    <NotificationContext.Provider value={{ list, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStore = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationProvider 안에서 사용하세요");
  return ctx;
};
