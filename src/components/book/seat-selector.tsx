import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { QUERY_KEY } from "@/lib/query/query-key";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SeatGrade } from "@/schemas/seat.schema";
import { getSeats } from "@/services/book.service";
import type { SeatLayout } from "@/schemas/layout.schema";

export interface SeatSelectorProps {
  eventId: string;
  priceMap: Record<SeatGrade, number>;
  maxSelectable?: number;
  onChange?: (selected: string[]) => void;
}

type Seat = SeatLayout["seats"][number];

const gradeColor: Record<SeatGrade, string> = {
  VIP: "bg-yellow-400 dark:bg-yellow-500",
  R: "bg-rose-500/90 dark:bg-rose-600",
  S: "bg-teal-500/80 dark:bg-teal-600",
  A: "bg-indigo-500/80 dark:bg-indigo-600",
  B: "bg-gray-400/70 dark:bg-gray-500",
  STANDING: "bg-lime-500/80 dark:bg-lime-600",
};

export const SeatSelector = ({
  eventId,
  priceMap,
  maxSelectable,
  onChange,
}: SeatSelectorProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY.EVENT.SEAT(eventId),
    queryFn: () => getSeats(eventId),
    select: (res) => res.data.data,
    staleTime: 5 * 60 * 1000,
  });

  const { matrix, seatMap } = useMemo(() => {
    const matrix = (data?.layout ?? []) as (string | null)[][];
    const seatMap = new Map<string, Seat>(
      data?.seats.map((s) => [s.location, s]) ?? []
    );
    return { matrix, seatMap };
  }, [data]);

  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (loc: string) =>
    setSelected((prev) => {
      if (prev.includes(loc)) return prev.filter((l) => l !== loc);

      if (maxSelectable && prev.length >= maxSelectable) {
        window.alert(`좌석은 최대 ${maxSelectable}개까지 선택할 수 있습니다.`);
        return prev;
      }
      return [...prev, loc];
    });

  const limitReached =
    maxSelectable !== undefined && selected.length >= maxSelectable;

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  if (isLoading)
    return (
      <div className="grid gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  if (isError || matrix.length === 0)
    return (
      <Alert variant="destructive">
        <AlertTitle>좌석 정보를 불러오지 못했습니다</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
        </AlertDescription>
      </Alert>
    );

  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="overflow-auto border rounded shadow-inner p-3 bg-background/40 max-w-full">
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r}>
                {row.map((loc, c) => {
                  if (!loc)
                    return (
                      <td key={c} className="p-0">
                        <div className="w-8 h-8" />
                      </td>
                    );

                  const seat = seatMap.get(loc)!;
                  const taken = !seat.available;
                  const sel = selected.includes(loc);
                  const disabled = taken || (!sel && limitReached);

                  return (
                    <td key={c} className="p-0">
                      <motion.button
                        type="button"
                        disabled={disabled}
                        title={`${seat.grade} / ${priceMap[
                          seat.grade
                        ]?.toLocaleString()}원`}
                        onClick={() => !disabled && toggle(loc)}
                        animate={{ scale: sel ? 1.2 : 1 }}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "w-8 h-8 border flex items-center justify-center text-[10px] leading-none transition-colors",
                          gradeColor[seat.grade],
                          disabled && "opacity-40 cursor-not-allowed",
                          sel
                            ? "ring-2 ring-offset-1 ring-primary bg-primary text-primary-foreground font-bold"
                            : "hover:scale-[1.15]"
                        )}
                      >
                        {taken ? "❌" : loc}
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid grid-cols-3 gap-2 text-xs">
        {(Object.keys(gradeColor) as SeatGrade[]).map((g) => (
          <li key={g} className="flex items-center gap-1 whitespace-nowrap">
            <span
              className={cn("inline-block w-4 h-4 border", gradeColor[g])}
            />
            {g} ({priceMap[g]?.toLocaleString()}원)
          </li>
        ))}
      </ul>

      {selected.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-4 inset-x-4 sm:hidden bg-card border rounded-xl shadow-lg p-4 flex justify-between items-center"
        >
          <span className="text-sm font-medium">
            {selected.length}석 선택 •{" "}
            {selected
              .reduce((sum, loc) => sum + priceMap[seatMap.get(loc)!.grade], 0)
              ?.toLocaleString()}
            원
          </span>
          <button
            className="text-primary font-semibold"
            onClick={() => onChange?.(selected)}
          >
            다음
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
