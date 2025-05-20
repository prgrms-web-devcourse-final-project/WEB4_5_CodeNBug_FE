import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Ticket, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeatSelector } from "@/components/book/seat-selector";
import { QUERY_KEY } from "@/lib/query/query-key";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getEvent, setSeat } from "@/services/event.service";
import { SeatGrade } from "@/schemas/seat.schema";
import { toast } from "sonner";
import { subscribeWaitingTickets } from "@/services/ticket.service";
import { usePaymentStore } from "@/store/payment.store";

const EventBookPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const nav = useNavigate();

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEY.EVENT.DETAIL(eventId!),
    queryFn: () => getEvent(eventId!),
    enabled: !!eventId,
    select: (res) => res.data.data,
    staleTime: 3 * 60 * 1000,
  });

  const [entryToken, setEntryToken] = useState<string | null>(null);
  const [, setQueueStatus] = useState<
    "IN_ENTRY" | "IN_PROGRESS" | "EXPIRED" | null
  >(null);
  const [queueOrder, setQueueOrder] = useState<number | null>(null);

  const waiting = entryToken === null;
  const ready = entryToken !== null;

  const sseCloseRef = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    if (!eventId) return;
    const close = subscribeWaitingTickets(eventId, (p) => {
      setEntryToken(p.token);
      setQueueStatus(p.status);
      setQueueOrder(p.userId);
    });

    sseCloseRef.current = close;

    return () => {
      close();
      sseCloseRef.current = undefined;
    };
  }, [eventId]);

  const [selected, setSelected] = useState<string[]>([]);

  const priceMap = useMemo(() => {
    if (!event?.prices) return {} as Record<SeatGrade, number>;

    return Object.fromEntries(
      event.prices.map(({ grade, amount }) => [
        typeof grade === "string" ? grade : grade,
        amount,
      ])
    ) as Record<SeatGrade, number>;
  }, [event]);

  const seatIdMap = useMemo(
    () =>
      new Map<string, number>(
        event?.seatLayout.seats.map(({ location, id }) => [location, id]) ?? []
      ),
    [event]
  );

  const seatGradeMap = useMemo(
    () =>
      new Map<string, SeatGrade>(
        event?.seatLayout.seats.map((s) => {
          return [s.location, s.grade as unknown as SeatGrade];
        }) ?? []
      ),
    [event]
  );

  const total = useMemo(
    () =>
      selected.reduce((acc, loc) => {
        const g = seatGradeMap.get(loc);
        return acc + (g ? priceMap[g] : 0);
      }, 0),
    [selected, seatGradeMap, priceMap]
  );

  const { setPaymentInfo } = usePaymentStore();

  const { mutate: reserveSeats, isPending } = useMutation({
    mutationFn: (vars: { seatList: number[]; token: string }) =>
      setSeat(eventId!, vars.seatList, vars.seatList.length, vars.token),

    onSuccess: (_res, vars) => {
      setPaymentInfo({
        eventId: eventId!,
        seatList: vars.seatList,
        amount: total,
        eventAuthToken: vars.token,
        closeQueue: sseCloseRef.current,
      });

      nav(`/events/${eventId}/pay`, { replace: true });
    },

    onError: (err) =>
      toast.error(
        (err as Error)?.message ??
          "좌석 확정 중 오류가 발생했습니다. 다시 시도해 주세요."
      ),
  });

  const handlePay = () => {
    if (!entryToken) return;
    const seatList = selected
      .map((loc) => seatIdMap.get(loc))
      .filter((id): id is number => id !== undefined);
    reserveSeats({ seatList, token: entryToken });
  };

  const canPay = ready && selected.length > 0 && !isPending;

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-8 w-60 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  if (isError || !event)
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>데이터를 불러오지 못했습니다</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-6" onClick={() => nav(-1)}>
          뒤로가기
        </Button>
      </div>
    );

  return (
    <motion.section
      className="container mx-auto px-4 py-8 flex flex-col gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => nav(-1)}
        className="mb-1 flex items-center gap-1"
      >
        <ArrowLeft size={16} /> 뒤로
      </Button>
      <h1 className="text-2xl font-bold">좌석 선택</h1>
      <p className="text-sm text-muted-foreground">
        {format(event.information.eventStart, "yyyy년 MM월 dd일 HH:mm", {
          locale: ko,
        })}
        &nbsp;• {event.information.hallName}
      </p>

      {ready ? (
        <SeatSelector
          eventId={eventId!}
          priceMap={priceMap}
          maxSelectable={4}
          onChange={setSelected}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 py-20">
          <p className="text-lg font-medium">대기열에 참여 중입니다…</p>
          {queueOrder !== null && (
            <p className="text-2xl font-bold text-primary">
              남은 순번&nbsp;{queueOrder}
            </p>
          )}
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">선택 좌석</h2>

        {selected.length === 0 ? (
          <p className="text-muted-foreground text-sm">좌석을 선택해주세요.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {selected.map((loc) => {
              const grade = seatGradeMap.get(loc);
              if (!grade) return null;

              const price = priceMap[grade];
              return (
                <li
                  key={loc}
                  className="px-2 py-1 rounded bg-primary/10 text-sm flex items-center gap-1"
                >
                  {loc} ({grade}) {price?.toLocaleString()}원
                  <button
                    aria-label="remove"
                    onClick={() =>
                      setSelected((prev) => prev.filter((l) => l !== loc))
                    }
                  >
                    <X size={12} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-base font-medium">
          좌석 {selected.length}개&nbsp;•&nbsp; 총 금액:{" "}
          <span className="text-lg font-bold">{total.toLocaleString()}원</span>
        </p>
      </div>

      <Button
        size="lg"
        className="w-full flex items-center gap-2"
        disabled={!canPay}
        onClick={handlePay}
      >
        <Ticket size={18} />
        {isPending
          ? "좌석 확인 중…"
          : waiting
          ? "대기 중…"
          : canPay
          ? "결제하기"
          : "좌석 선택 필요"}
      </Button>
    </motion.section>
  );
};

export default EventBookPage;
