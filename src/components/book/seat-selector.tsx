import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { QUERY_KEY } from "@/lib/query/query-key";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SeatGrade } from "@/schemas/seat.schema";
import { getSeats } from "@/services/book.service";

export interface SeatSelectorProps {
  eventId: string;
  onSelect?: (seatId: string | null) => void;
}

const gradeColor: Record<SeatGrade, string> = {
  VIP: "bg-yellow-400 dark:bg-yellow-500",
  R: "bg-rose-500/90 dark:bg-rose-600",
  S: "bg-teal-500/80 dark:bg-teal-600",
  A: "bg-indigo-500/80 dark:bg-indigo-600",
  B: "bg-gray-400/70 dark:bg-gray-500",
  STANDING: "bg-lime-500/80 dark:bg-lime-600",
};

export const SeatSelector = ({ eventId, onSelect }: SeatSelectorProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEY.EVENT.SEAT(eventId),
    queryFn: () => getSeats(eventId),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  });

  const { matrix } = useMemo(() => {
    if (!data) return { matrix: [], widths: 0 };
    return { matrix: data.layout, widths: data.layout?.[0]?.length };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !matrix?.length) {
    return (
      <Alert variant="destructive">
        <AlertTitle>좌석 정보를 불러오지 못했습니다</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="overflow-auto border rounded shadow-inner p-3 bg-background/40"
        style={{ maxWidth: "100%" }}
      >
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((seatId, cIdx) => (
                  <td key={cIdx} className="p-0">
                    <button
                      type="button"
                      disabled={!seatId}
                      onClick={() => onSelect?.(seatId ?? null)}
                      className={cn(
                        "w-8 h-8 border flex items-center justify-center text-[10px] leading-none"
                        // seatId
                        //   ? gradeColor[
                        //       data?.seat[seatId].grade as
                        //         | "VIP"
                        //         | "R"
                        //         | "S"
                        //         | "A"
                        //         | "B"
                        //         | "STANDING"
                        //     ]
                        //   : "bg-muted/40 cursor-default"
                      )}
                    >
                      {seatId ?? ""}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 등급 Legend */}
      <ul className="grid grid-cols-3 gap-2 text-xs mt-2">
        {(Object.keys(gradeColor) as SeatGrade[]).map((g) => (
          <li key={g} className="flex items-center gap-1">
            <span
              className={cn("inline-block w-4 h-4 border", gradeColor[g])}
            />
            {g}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
