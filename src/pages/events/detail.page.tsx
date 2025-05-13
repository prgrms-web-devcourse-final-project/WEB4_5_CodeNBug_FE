"use client";

import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAvailableSeat, getEvent } from "@/services/event.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { motion } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-10">
    <Skeleton className="h-8 w-60 mb-6" />
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-80 w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    </div>
  </div>
);

export const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

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
    staleTime: 1000 * 60 * 5,
  });

  const { data: availableSeat } = useQuery({
    queryKey: QUERY_KEY.EVENT.AVAILABLE(eventId!),
    queryFn: () => getAvailableSeat(eventId!),
    enabled: !!eventId,
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <DetailSkeleton />;

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

  const {
    information,
    bookingStart,
    bookingEnd,
    viewCount,
    seatSelectable,
    status,
  } = event;

  const canBook =
    status === "OPEN" &&
    seatSelectable &&
    new Date() >= new Date(bookingStart) &&
    new Date() <= new Date(bookingEnd);

  return (
    <motion.section
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      <h1 className="mb-6 text-2xl font-bold dark:text-primary-foreground">
        {information.title}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-xl">
          <CardHeader className="p-0">
            <img
              src={information.thumbnailUrl}
              alt={information.title}
              className="h-80 w-full object-cover"
              loading="lazy"
            />
          </CardHeader>
        </Card>
        <Card className="flex flex-col">
          <CardContent className="flex-1 space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{information.hallName}</Badge>
              <Badge variant={status === "OPEN" ? "default" : "outline"}>
                {status === "OPEN" ? "예매 가능" : "예매 마감"}
              </Badge>
            </div>

            <p className="text-lg font-medium dark:text-primary-foreground">
              {format(information.eventStart, "yyyy년 MM월 dd일 HH:mm", {
                locale: ko,
              })}
              &nbsp;~&nbsp;
              {format(information.eventEnd, "HH:mm", { locale: ko })}
            </p>

            <p className="text-sm text-muted-foreground">
              예매 기간:&nbsp;
              {format(bookingStart, "yyyy-MM-dd HH:mm", { locale: ko })} ~{" "}
              {format(bookingEnd, "yyyy-MM-dd HH:mm", { locale: ko })}
            </p>

            <p className="text-sm text-muted-foreground">
              관람 가능 연령:{" "}
              {information.ageLimit === 0
                ? "전체"
                : `${information.ageLimit}세 이상`}
            </p>

            <p className="text-sm text-muted-foreground">조회수: {viewCount}</p>
            <p className="text-sm text-muted-foreground">
              선택가능 좌석 수: {availableSeat?.available}
            </p>

            <Separator className="my-2" />

            <p className="text-base">
              좌석 선택&nbsp;
              {seatSelectable ? "가능" : "불가"}
            </p>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full"
              disabled={!canBook}
              onClick={() => canBook && navigate(`/events/${eventId}/book`)}
            >
              {canBook ? "예매하기" : "예매 불가"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.section>
  );
};

export default EventDetailPage;
