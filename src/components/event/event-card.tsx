import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { motion } from "motion/react";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    date: string;
    thumb: string;
    price: number;
  };
};

export const EventCard = ({ event }: EventCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="h-full"
  >
    <Card className="group h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg pt-0">
      <CardHeader className="relative p-0">
        <motion.img
          src={event.thumb}
          alt={event.title}
          loading="lazy"
          className="h-40 w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
      </CardHeader>
      <CardContent className="space-y-2 p-4 flex flex-col flex-1">
        <h3 className="line-clamp-2 font-medium flex-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.date}</p>
        <p className="text-primary text-sm font-semibold">
          {event.price.toLocaleString()}원~
        </p>
        <Button variant="outline" size="sm" asChild className="mt-2 w-full">
          <Link to={`/events/${event.id}`}>예매하기</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);
