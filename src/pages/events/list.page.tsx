import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getAllEvents } from "@/services/event.service";
import { EventCategory, EventListItem } from "@/schemas/event.schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { EventCard } from "@/components/event/event-card";

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
  const uiPage = Math.max(Number(params.get("page") ?? "1"), 1);
  const pageIdx = uiPage - 1;
  const size = Math.max(Number(params.get("size") ?? "8"), 1);

  const initCats = useMemo(() => {
    const many = params.getAll("category");
    if (many.length) return many;
    const one = params.get("category");
    return one ? [one] : [];
  }, [params]);

  const [range, setRange] = useState(DEFAULT_RANGE);
  const [categories, setCategories] = useState<string[]>(initCats);
  const [keyword, setKeyword] = useState(() => {
    return (params.get("keyword") ?? "").toLowerCase();
  });

  const dRange = useDeferredValue(range);
  const dCats = useDeferredValue(categories);
  const dKey = useDebouncedValue(keyword, 500);

  const qc = useQueryClient();
  const { data, isLoading, isError, isFetching, error } = useQuery({
    queryKey: ["events", pageIdx, size, dRange, dCats, dKey],
    queryFn: () =>
      getAllEvents({
        page: pageIdx,
        size,
        costRange: dRange,
        eventCategoryList: dCats,
        keyword: dKey,
      }),
    staleTime: Infinity,
    placeholderData: (old) => old,
  });

  const items: EventListItem[] = data?.data.data?.content ?? [];
  const totalPages = data?.totalPages ?? uiPage;

  if (pageIdx < (data?.totalPages ?? uiPage) - 1) {
    qc.prefetchQuery({
      queryKey: ["events", pageIdx + 1, size, dRange, dCats, dKey],
      queryFn: () =>
        getAllEvents({
          page: pageIdx + 1,
          size,
          costRange: dRange,
          eventCategoryList: dCats,
          keyword: dKey,
        }),
      staleTime: Infinity,
    });
  }

  const goPage = (p: number) =>
    setParams({ page: String(p), size: String(size) });

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (dKey) next.set("keyword", dKey);
    else next.delete("keyword");

    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true });
    }
  }, [dKey]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.delete("category");
    dCats.forEach((c) => next.append("category", c));
    if (next.toString() !== params.toString())
      setParams(next, { replace: true });
  }, [dCats]);

  useEffect(() => {
    if (uiPage !== 1) {
      setParams({ page: "1", size: String(size) }, { replace: true });
    }
  }, [dRange, dCats, dKey]);

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
          <h2 className="text-sm font-medium mb-2">검색</h2>
          <Input
            placeholder="공연명, 장소 등을 검색하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toLowerCase())}
          />
        </div>

        <Separator />
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
        <h1 className="text-2xl font-bold">모든 행사</h1>
      </header>

      <div className="flex flex-col gap-6">
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

        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={uiPage === 1 || isFetching}
            onClick={() => goPage(1)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={uiPage === 1 || isFetching}
            onClick={() => goPage(uiPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="w-16 text-center tabular-nums text-sm">
            {uiPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={uiPage >= totalPages || isFetching}
            onClick={() => goPage(uiPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={uiPage >= totalPages || isFetching}
            onClick={() => goPage(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const SkeletonGrid = ({ count }: { count: number }) => (
  <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-80 w-full rounded-xl" />
    ))}
  </section>
);

export default EventListPage;
