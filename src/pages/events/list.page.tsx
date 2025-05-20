import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getAllEvents } from "@/services/event.service";
import { EventCategory, EventListItem } from "@/schemas/event.schema";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useDeferredValue, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_RANGE = { min: 0, max: 999999 };
const CATEGORY_OPTIONS: EventCategory[] = [
  "CONCERT",
  "MUSICAL",
  "EXHIBITION",
  "SPORTS",
  "FAN_MEETING",
  "ETC",
];

export const EventListPage = () => {
  const [params, setParams] = useSearchParams();
  const page = Math.max(Number(params.get("page") ?? "1"), 1);
  const size = Math.max(Number(params.get("size") ?? "8"), 1);

  const [range, setRange] = useState(DEFAULT_RANGE);
  const [categories, setCategories] = useState<string[]>([]);

  const dRange = useDeferredValue(range);
  const dCats = useDeferredValue(categories);

  const qc = useQueryClient();
  const { data, isLoading, isError, isFetching, error } = useQuery({
    queryKey: ["events", page, size, dRange, dCats],
    queryFn: () =>
      getAllEvents({
        page,
        size,
        costRange: dRange,
        eventCategoryList: dCats,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (res) => res,
  });

  const items: EventListItem[] = data?.data.data?.content ?? [];
  const totalPages = data?.totalPages ?? page;

  if (page < totalPages) {
    qc.prefetchQuery({
      queryKey: ["events", page + 1, size, dRange, dCats],
      queryFn: () =>
        getAllEvents({
          page: page + 1,
          size,
          costRange: dRange,
          eventCategoryList: dCats,
        }),
    });
  }

  const goPage = (p: number) =>
    setParams({ page: String(p), size: String(size) });

  if (isLoading && !data) return <SkeletonGrid count={size} />;

  if (isError)
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

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-6 rounded-lg border p-4 space-y-6">
        <div>
          <h2 className="text-sm font-medium mb-2">가격(₩)</h2>
          <Slider
            value={[range.min, range.max]}
            step={1000}
            min={0}
            max={999999}
            onValueChange={([min, max]) => setRange({ min, max })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {range.min.toLocaleString()}원 ~ {range.max.toLocaleString()}원
          </p>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-3">
          {CATEGORY_OPTIONS.map((c) => (
            <label key={c} className="flex items-center gap-1 text-sm">
              <Checkbox
                checked={categories.includes(c)}
                onCheckedChange={(checked) =>
                  setCategories((prev) =>
                    checked ? [...prev, c] : prev.filter((v) => v !== c)
                  )
                }
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-primary-foreground">
          모든 행사
        </h1>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page === 1 || isFetching}
            onClick={() => goPage(1)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={page === 1 || isFetching}
            onClick={() => goPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="w-16 text-center tabular-nums text-sm">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages || isFetching}
            onClick={() => goPage(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages || isFetching}
            onClick={() => goPage(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((ev) => (
            <motion.div
              key={ev.eventId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              layout
            >
              <EventCard event={ev} />
            </motion.div>
          ))}

          {isFetching &&
            Array.from({ length: size - items.length }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
        </div>
      </AnimatePresence>
    </section>
  );
};

const EventCard = ({ event }: { event: EventListItem }) => (
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
);

const SkeletonGrid = ({ count }: { count: number }) => (
  <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-80 w-full rounded-xl" />
    ))}
  </section>
);

export default EventListPage;
