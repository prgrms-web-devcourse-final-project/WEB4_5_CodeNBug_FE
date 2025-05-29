import { Link } from "react-router";
import { motion } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, MapPin, Eye, Ticket } from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { EventListItem } from "@/schemas/event.schema";

interface EventCardProps {
  event: EventListItem;
}

export const EventCard = ({ event }: EventCardProps) => {
  const {
    eventId,
    category,
    information,
    bookingStart,
    bookingEnd,
    viewCount,
    status,
    seatSelectable,
    minPrice,
    maxPrice,
  } = event;

  const bookingClosed = status !== "OPEN";

  const dateRange = `${format(new Date(information.eventStart), "yyyy.MM.dd", {
    locale: ko,
  })} ~ ${format(new Date(information.eventEnd), "MM.dd", { locale: ko })}`;

  const bookingRange = `${format(new Date(bookingStart), "yyyy.MM.dd", {
    locale: ko,
  })} ~ ${format(new Date(bookingEnd), "MM.dd", { locale: ko })}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg">
        <CardHeader className="relative p-0">
          <motion.img
            src={information.thumbnailUrl}
            alt={information.title}
            loading="lazy"
            className="h-44 w-full object-cover transition-transform"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          <div className="absolute inset-x-0 top-0 flex justify-between p-2">
            <Badge
              variant={bookingClosed ? "secondary" : "default"}
              className="text-xs"
            >
              {status === "OPEN" ? "예매 가능" : "예매 종료"}
            </Badge>
            <Badge
              variant={seatSelectable ? "default" : "secondary"}
              className="flex items-center gap-1 text-xs"
            >
              <Ticket className="size-3" />
              {seatSelectable ? "좌석 선택" : "랜덤"}
            </Badge>
          </div>

          <div className="absolute bottom-0 right-0 flex items-center gap-1 rounded-tl-lg bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Eye className="size-3" />
            {viewCount.toLocaleString()}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline">{category}</Badge>
            <Badge variant="secondary">
              {information.ageLimit ? `${information.ageLimit}+` : "전체관람"}
            </Badge>
          </div>

          <CardTitle className="line-clamp-2 text-base">
            {information.title}
          </CardTitle>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3 shrink-0" />
            공연&nbsp;{dateRange}
          </p>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3 shrink-0" />
            예매&nbsp;{bookingRange}
          </p>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {information.hallName}
          </p>

          <p className="mt-auto text-sm font-semibold text-primary">
            {minPrice?.toLocaleString()}원
            {minPrice !== maxPrice && ` ~ ${maxPrice?.toLocaleString()}원`}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            size="sm"
            disabled={bookingClosed}
            className="w-full"
            variant={bookingClosed ? "secondary" : "outline"}
          >
            <Link to={`/events/${eventId}`}>
              {bookingClosed ? "예매 마감" : "예매하기"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
