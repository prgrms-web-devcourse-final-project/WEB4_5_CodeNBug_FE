import { motion } from "motion/react";
import { EventCard } from "../event/event-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const dummyEvents = new Array(8).fill(null).map((_, i) => ({
  id: `demo-${i}`,
  title: `인기 이벤트 #${i + 1}`,
  date: "2025-05-1" + i,
  thumb: `https://picsum.photos/seed/${i + 20}/400/300`,
  price: 55000 + i * 3000,
}));

export const PopularEventsSection = () => (
  <section className="container mx-auto space-y-6 px-4">
    <h2 className="text-2xl font-semibold">인기 행사</h2>
    <Carousel className="relative flex flex-col gap-4">
      <CarouselContent>
        {dummyEvents.map((ev, idx) => (
          <CarouselItem
            key={ev.id}
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
  </section>
);
