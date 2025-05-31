import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SeatGrade } from "@/schemas/seat.schema";
import { type CreateEventPayload } from "@/schemas/manager.schema";

interface SeatLayoutBuilderProps {
  seatCount: number;
  value: CreateEventPayload["layout"];
  onChange: (v: CreateEventPayload["layout"]) => void;
}

const gradeOptions: SeatGrade[] = ["VIP", "R", "S", "A", "B", "STANDING"];
const gradeShort: Record<SeatGrade, string> = {
  VIP: "V",
  R: "R",
  S: "S",
  A: "A",
  B: "B",
  STANDING: "T",
};
const letter = (i: number) => String.fromCharCode(65 + i);

export const SeatLayoutBuilder = ({
  seatCount,
  value,
  onChange,
}: SeatLayoutBuilderProps) => {
  const [rowInput, setRowInput] = useState(String(value?.layout?.length || 1));
  const [colInput, setColInput] = useState(
    String(value?.layout?.[0]?.length || 1)
  );
  const rows = Math.max(1, Number(rowInput) || 1);
  const cols = Math.max(1, Number(colInput) || 1);

  const [rowOverride, setRowOverride] = useState<Record<number, SeatGrade>>({});

  useEffect(() => {
    let created = 0;

    const nextLayout: (string | null)[][] = Array.from(
      { length: rows },
      (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const existing = value?.layout?.[r]?.[c];
          if (existing) {
            created++;
            return existing;
          }

          if (created < seatCount) {
            created++;
            return `${letter(r)}${c + 1}`;
          }
          return null;
        })
    );

    const nextSeat: typeof value.seat = {};
    nextLayout.forEach((row) =>
      row.forEach((id) => {
        if (!id) return;
        nextSeat[id] = value.seat[id] ?? { grade: "A" };
      })
    );

    onChange({ layout: nextLayout, seat: nextSeat });
  }, [rows, cols, seatCount]);

  const seatSelected = value.layout.flat().filter(Boolean).length;

  const changeGrade = useCallback(
    (id: string, grade: SeatGrade) => {
      onChange({ ...value, seat: { ...value.seat, [id]: { grade } } });
    },
    [onChange, value]
  );

  const setRowGrade = useCallback(
    (r: number, grade: SeatGrade) => {
      const seatMap = { ...value.seat };
      value.layout[r].forEach((id) => {
        if (id) seatMap[id] = { grade };
      });
      setRowOverride((prev) => ({ ...prev, [r]: grade }));
      onChange({ ...value, seat: seatMap });
    },
    [value, onChange]
  );

  const grid = useMemo(
    () =>
      value.layout.map((row, r) =>
        row.map((id, c) => ({
          id,
          grade: id ? (value.seat[id].grade as SeatGrade) : "A",
          r,
          c,
        }))
      ),
    [value]
  );

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            value={rowInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRowInput(e.target.value)
            }
            className="w-20"
          />
          <span className="text-sm">rows ×</span>
          <Input
            type="number"
            min={1}
            value={colInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setColInput(e.target.value)
            }
            className="w-20"
          />
          <span className="text-sm">cols</span>
        </div>

        <Badge variant="outline">
          {seatSelected}/{seatCount}
        </Badge>
      </div>

      <div className="overflow-auto rounded border">
        <table className="select-none border-collapse">
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                <td className="h-10 w-10 border bg-muted/20 p-0 text-center">
                  <Select
                    value={rowOverride[r]}
                    onValueChange={(g) => setRowGrade(r, g as SeatGrade)}
                  >
                    <SelectTrigger className="h-10 w-10 p-0 text-xs leading-none">
                      <SelectValue>
                        {rowOverride[r]
                          ? gradeShort[rowOverride[r]]
                          : letter(r)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent side="top">
                      {gradeOptions.map((g) => (
                        <SelectItem key={g} value={g} className="text-xs">
                          <span className="inline-block w-4 text-center font-mono text-sm">
                            {gradeShort[g]}
                          </span>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {row.map((cell) => (
                  <td
                    key={`${cell.r}-${cell.c}`}
                    className="h-10 w-10 border p-0"
                  >
                    {cell.id ? (
                      <Select
                        value={cell.grade}
                        onValueChange={(g) =>
                          changeGrade(cell.id!, g as SeatGrade)
                        }
                      >
                        <SelectTrigger className="h-10 w-10 p-0 text-xs leading-none">
                          <SelectValue>{gradeShort[cell.grade]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent side="top">
                          {gradeOptions.map((g) => (
                            <SelectItem key={g} value={g} className="text-xs">
                              <span className="inline-block w-4 text-center font-mono text-sm">
                                {gradeShort[g]}
                              </span>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-full w-full bg-muted/20" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {gradeOptions.map((g) => (
          <Badge
            key={g}
            variant="outline"
            className="flex items-center gap-1 text-xs"
          >
            <span className="inline-block w-4 text-center font-mono text-sm">
              {gradeShort[g]}
            </span>
            {g}
          </Badge>
        ))}
      </div>
    </div>
  );
};
