import { motion } from "motion/react";
import { EventCard } from "../event/event-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { getRecommendEvents } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query/query-key";
import { Button } from "../ui/button";

const EventCardSkeleton = () => (
  <div className="h-[280px] w-full rounded-lg bg-muted/30 animate-pulse" />
);

export const PopularEventsSection = () => {
  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY.EVENT.RECOMMEND(5),
    queryFn: () => getRecommendEvents(5),
    staleTime: Infinity,
    select: (res) => res.data.data,
  });

  return (
    <section className="container mx-auto space-y-6 px-4">
      <h2 className="text-2xl font-semibold">인기 행사</h2>
      {isLoading && (
        <Carousel className="relative flex flex-col gap-4">
          <CarouselContent>
            {[...Array(5)].map((_, idx) => (
              <CarouselItem
                key={idx}
                className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <EventCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-4 py-10">
          <p className="text-muted-foreground">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </div>
      )}
      {events?.length ? (
        <Carousel className="relative flex flex-col gap-4">
          <CarouselContent>
            {events.map((ev, idx) => (
              <CarouselItem
                key={ev.eventId}
                className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-2"
                >
                  <EventCard event={ev} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </div>
        </Carousel>
      ) : (
        !isLoading &&
        !isError && (
          <p className="py-10 text-center text-muted-foreground">
            현재 추천할 행사가 없습니다.
          </p>
        )
      )}
    </section>
  );
};
