import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const dummy = Array.from({ length: 3 }).map((_, i) => ({
  id: i,
  title: `예매 이벤트 #${i + 1}`,
  date: `2025-05-${10 + i}`,
  price: `${55_000 + i * 3_000}원`,
}));

export const TicketsSection = () => {
  return (
    <motion.section layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dummy.map((t) => (
        <Card
          key={t.id}
          className={clsx(
            "flex flex-col bg-card border dark:border-gray-700",
            "hover:-translate-y-1 hover:shadow-lg transition-transform"
          )}
        >
          <CardHeader className="text-lg font-semibold">{t.title}</CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              날짜: {t.date}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              가격: {t.price}~
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full">
              상세 보기
            </Button>
          </CardFooter>
        </Card>
      ))}
    </motion.section>
  );
};
