import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Bell, Circle, CheckCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyInfo } from "@/services/query/user.query";
import {
  useNotifications,
  useNotificationDetail,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/services/query/notification.query";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export const NotificationBell = () => {
  const { data: me } = useMyInfo();
  const userId = me?.id ?? -1;
  const { data: list = [] } = useNotifications(userId);

  const [openId, setOpenId] = useState<number>();
  const { data: detail, isFetching } = useNotificationDetail(userId, openId);

  const { mutate: removeOne } = useDeleteNotification(userId);
  const { mutate: removeAll, isPending: clearing } =
    useDeleteAllNotifications(userId);

  const unreadCount = list.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative">
        <Button variant="ghost" size="icon" aria-label="알림">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1.5 py-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 text-sm font-semibold">
          알림
          {list.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                removeAll(undefined, {
                  onSuccess: () => toast.success("모든 알림이 삭제되었습니다."),
                  onError: () => toast.error("삭제에 실패했습니다."),
                })
              }
              disabled={clearing}
            >
              전체 삭제
            </Button>
          )}
        </div>
        <Separator />

        {list.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            알림이 없습니다.
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={openId ? String(openId) : undefined}
            onValueChange={(value) => {
              const id = Number(value);
              setOpenId(Number.isNaN(id) ? undefined : id);
            }}
            className="w-full"
          >
            {list.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <AccordionItem value={String(n.id)} className="px-0">
                  <AccordionTrigger className="flex w-full items-center gap-2 px-4 py-2 hover:bg-accent/50">
                    {n.isRead ? (
                      <CheckCircle className="size-4 text-muted-foreground" />
                    ) : (
                      <Circle className="size-4 text-primary" />
                    )}

                    <span className="flex-1 line-clamp-1 text-left">
                      {/* {n.title} */}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOne(n.id, {
                          onSuccess: () => toast.success("삭제되었습니다."),
                          onError: () => toast.error("삭제에 실패했습니다."),
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </AccordionTrigger>

                  <AccordionContent className="px-8 pb-4 text-sm">
                    {isFetching && !detail ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      <pre className="whitespace-pre-wrap">
                        {detail?.content}
                      </pre>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
