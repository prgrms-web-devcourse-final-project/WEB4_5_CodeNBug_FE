"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "@/services/event.service";
import { Event } from "@/schemas/event.schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { QUERY_KEY } from "@/lib/query/query-key";

export const EventListPage = () => {
  const {
    data: events,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: QUERY_KEY.EVENT.LIST,
    queryFn: getAllEvents,
    select: (res) => res.data.data ?? [],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: (prevData) => prevData,
  });

  if (isLoading || (!events?.length && isFetching)) {
    return (
      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>데이터 불러오기 실패</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold dark:text-primary-foreground">
        모든 행사
      </h1>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events?.map((event: Event) => (
            <motion.div
              key={event.eventId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              layout
            >
              <Card className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md dark:bg-muted/30">
                <CardHeader className="p-0">
                  <img
                    src={event.information.thumbnailUrl}
                    alt={event.information.title}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <CardTitle className="line-clamp-2 text-lg leading-tight dark:text-primary-foreground">
                    {event.information.title}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    {format(event.information.eventStart, "yyyy-MM-dd HH:mm", {
                      locale: ko,
                    })}
                  </p>

                  <p className="mt-auto text-base font-medium dark:text-primary-foreground">
                    {event.information.hallName}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" asChild>
                    <a href={`/events/${event.eventId}`}>예매하기</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
};

export default EventListPage;
