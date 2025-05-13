import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeatSelector } from "@/components/book/seat-selector";
import { useQuery } from "@tanstack/react-query";
import { getEvent } from "@/services/event.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 예매 페이지 – 1차: 좌석 선택 & 요약
 */
const EventBookPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  /** 선택된 좌석 ID 배열 */
  const [selected, setSelected] = useState<(string | null)[]>([]);

  /** 이벤트 정보 (가격 · 시간) */
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
    staleTime: 1000 * 60 * 3,
  });

  const setSeatHandler = (seatId: string | null) => {
    setSelected((prevState) => [...prevState, seatId]);
  };

  // const totalPrice = useMemo(() => {
  //   if (!event) return 0;
  //   const priceMap = Object.fromEntries(
  //     event.prices.map((p: { grade: string; amount: number }) => [
  //       p.grade,
  //       p.amount,
  //     ])
  //   );
  //   return selected.reduce((sum, id) => {
  //     const grade = event.seat.grade[id];
  //     return sum + (priceMap[grade] ?? 0);
  //   }, 0);
  // }, [event, selected]);

  /* ───────── 렌더 ───────── */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-8 w-60 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>데이터를 불러오지 못했습니다</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
          뒤로가기
        </Button>
      </div>
    );
  }

  const canProceed = selected.length > 0;

  return (
    <motion.section
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* 헤더 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1"
      >
        <ArrowLeft size={16} /> 뒤로
      </Button>

      <h1 className="text-2xl font-bold">좌석 선택</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {format(event.information.eventStart, "yyyy년 MM월 dd일 HH:mm", {
          locale: ko,
        })}
        &nbsp;• {event.information.hallName}
      </p>

      {/* 좌석 선택기 */}
      <SeatSelector eventId={eventId!} onSelect={setSeatHandler} />

      <Separator className="my-6" />

      {/* 선택 요약 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">선택 좌석</h2>
        {selected.length === 0 ? (
          <p className="text-muted-foreground text-sm">좌석을 선택해주세요.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {selected.map((id) => (
              <li key={id} className="px-2 py-1 rounded bg-primary/10 text-sm">
                {id}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-base font-medium">
          총 금액:{" "}
          {/* <span className="font-bold">{totalPrice.toLocaleString()}원</span> */}
        </p>
      </div>

      <Button
        className="mt-6 w-full flex items-center gap-2"
        disabled={!canProceed}
        onClick={() => {
          /* TODO: 결제 플로우로 이동 */
        }}
      >
        <Ticket size={18} /> {canProceed ? "결제하기" : "좌석 선택 필요"}
      </Button>
    </motion.section>
  );
};

export default EventBookPage;
