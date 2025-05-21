"use client";

import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getEvent, getAvailableSeat } from "@/services/event.service";
import { QUERY_KEY } from "@/lib/query/query-key";
import { motion } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";

const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-10">
    <Skeleton className="mb-6 h-8 w-60" />
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-80 w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="h-20 w-full" />
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
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const { data: availableSeat } = useQuery({
    queryKey: QUERY_KEY.EVENT.AVAILABLE(eventId!),
    queryFn: () => getAvailableSeat(eventId!),
    enabled: !!eventId,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

  const sortedPrices = useMemo(
    () => [...(event?.data?.prices ?? [])].sort((a, b) => a.amount - b.amount),
    [event?.data?.prices]
  );
  const minPrice = sortedPrices[0]?.amount ?? 0;
  const maxPrice = sortedPrices.at(-1)?.amount ?? 0;

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

  if (!event.data) return null;

  const {
    information,
    bookingStart,
    bookingEnd,
    viewCount,
    seatSelectable,
    status,
  } = event.data;

  const now = new Date();
  const canBook =
    status === "OPEN" &&
    seatSelectable &&
    now >= new Date(bookingStart) &&
    now <= new Date(bookingEnd);

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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{information.hallName}</Badge>
              <Badge variant="outline">{information.location}</Badge>
              <Badge variant={status === "OPEN" ? "default" : "outline"}>
                {canBook ? "예매 가능" : "예매 불가능"}
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
              가격:&nbsp;
              {minPrice === maxPrice
                ? `${minPrice.toLocaleString()}원`
                : `${minPrice.toLocaleString()} ~ ${maxPrice.toLocaleString()}원`}
            </p>
            <ul className="flex flex-wrap gap-2">
              {sortedPrices.map(({ id, grade, amount }) => (
                <li
                  key={id}
                  className="px-2 py-[2px] rounded bg-primary/10 text-sm"
                >
                  {grade}: {amount.toLocaleString()}원
                </li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground">
              좌석 수:&nbsp;{information.seatCount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              관람 가능 연령:&nbsp;
              {information.ageLimit === 0
                ? "전체"
                : `${information.ageLimit}세 이상`}
            </p>
            <p className="text-sm text-muted-foreground">
              조회수:&nbsp;{viewCount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              선택 가능 좌석:&nbsp;{availableSeat?.data ?? "-"}
            </p>

            <Separator className="my-2" />
            <p className="whitespace-pre-wrap">{information.description}</p>
            {information.restrictions && (
              <p className="text-sm text-destructive/80">
                * {information.restrictions}
              </p>
            )}
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
