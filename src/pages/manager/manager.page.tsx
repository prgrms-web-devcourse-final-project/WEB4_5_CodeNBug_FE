import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

import {
  createManagerEvent,
  updateManagerEvent,
  deleteManagerEvent,
  getManagerEvents,
} from "@/services/manager.service";
import {
  CreateEventPayload,
  UpdateEventPayload,
  ResManagerEvent,
} from "@/schemas/manager.schema";
import { QUERY_KEY } from "@/lib/query/query-key";
import { EventCreateWizard } from "@/components/manager/event-create-wizard";
import { NotificationCreateDrawer } from "@/components/manager/notification-create-drawer";
import { createNotification } from "@/services/notification.service";
import { toast } from "sonner";
import { EventPurchasesDrawer } from "@/components/manager/event-purchases-drawer";

export const ManagerPage = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResManagerEvent["data"] | null>(null);
  const [openNotice, setOpenNotice] = useState(false);

  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEY.MANAGER.DEFAULT,
    queryFn: getManagerEvents,
    select: (res) => res.data.data ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const noticeMut = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      toast.success("공지 발송 완료");
      setOpenNotice(false);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "공지 발송에 실패했습니다.";
      toast.error(msg);
    },
  });

  const createMut = useMutation({
    mutationFn: (p: CreateEventPayload) => createManagerEvent(p),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEY.MANAGER.DEFAULT,
      });
      setOpen(false);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEventPayload;
    }) => updateManagerEvent(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEY.MANAGER.DEFAULT,
      });
      setOpen(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteManagerEvent(id),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: QUERY_KEY.MANAGER.DEFAULT,
      }),
  });

  const handleSubmit = (
    payload: CreateEventPayload,
    original?: typeof editing
  ) => {
    if (original) {
      const id = String(original.eventId ?? original.eventId);
      const updatePayload = payload as UpdateEventPayload;
      updateMut.mutate({ id, payload: updatePayload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) deleteMut.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>리스트 불러오기 실패</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.section
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">행사 관리</h1>{" "}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenNotice(true)}>
            공지 작성
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + 행사 생성
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          등록된 행사가 없습니다.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>예매 기간</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events
              .filter((ev) => !ev.isDeleted)
              .map((ev) => (
                <TableRow key={ev.eventId} className="h-16">
                  <TableCell className="font-medium">{ev.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{ev.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(ev.startDate, "yyyy.MM.dd HH:mm")} ~{" "}
                    {format(ev.endDate, "yyyy.MM.dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(ev.bookingStart, "yyyy.MM.dd HH:mm")} ~{" "}
                    {format(ev.bookingEnd, "yyyy.MM.dd HH:mm")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <EventPurchasesDrawer eventId={ev.eventId} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(ev);
                        setOpen(true);
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(String(ev.eventId))}
                      disabled={deleteMut.isPending}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      <EventCreateWizard
        initial={editing}
        open={open}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
          setOpen(o);
        }}
        onSubmit={(payload) => handleSubmit(payload, editing)}
      />
      <NotificationCreateDrawer
        open={openNotice}
        onOpenChange={setOpenNotice}
        onSubmit={(p) => noticeMut.mutate(p)}
      />
    </motion.section>
  );
};

export default ManagerPage;
