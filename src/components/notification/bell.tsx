import { Bell, CheckCircle, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/providers/notification-provider";
import { useReadNotification } from "@/services/query/notification.query";

const useUnreadCount = () => {
  const { list } = useNotificationStore();
  return list.filter((n) => !n.isRead).length;
};

export const NotificationBell = () => {
  const { list, dispatch } = useNotificationStore();
  const read = useReadNotification();
  const unread = useUnreadCount();

  const handleRead = (id: number) => async () => {
    await read(id);
    dispatch({ type: "MARK_READ", id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative">
        <Button variant="ghost" size="icon" aria-label="알림">
          <Bell className="size-5" />
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1.5 py-0 text-[10px]"
            >
              {unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 text-sm font-semibold">알림</div>
        <Separator />
        {list.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            알림이 없습니다.
          </div>
        )}
        {list.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className="gap-2 py-2"
            onClick={handleRead(n.id)}
          >
            {n.isRead ? (
              <CheckCircle className="size-4 text-muted-foreground" />
            ) : (
              <Circle className="size-4 text-primary" />
            )}
            <span className="line-clamp-2">{n.content}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
