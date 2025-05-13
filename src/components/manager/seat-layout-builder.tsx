import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEventPayload } from "@/schemas/manager.schema";
import { SeatGrade } from "@/schemas/seat.schema";

const seatGrades: SeatGrade[] = Object.values(SeatGrade) as SeatGrade[];

const createMatrix = (rows: number, cols: number): (string | null)[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(null));

interface SeatLayoutBuilderProps {
  value: CreateEventPayload["layout"];
  onChange: (v: CreateEventPayload["layout"]) => void;
}

export const SeatLayoutBuilder = ({
  value,
  onChange,
}: SeatLayoutBuilderProps) => {
  const { watch } = useFormContext<CreateEventPayload>();
  const seatCount = watch("seatCount");

  const [rowInput, setRowInput] = useState(String(value.layout.length || 1));
  const [colInput, setColInput] = useState(
    String(value.layout[0]?.length || 1)
  );

  const rows = Math.max(0, Number(rowInput) || 0);
  const cols = Math.max(0, Number(colInput) || 0);
  const cellTotal = rows * cols;
  const overLimit =
    seatCount !== undefined && seatCount > 0 && cellTotal > seatCount;

  useEffect(() => {
    if (!rows || !cols) return;

    const nextLayout = createMatrix(rows, cols);
    const nextSeat: CreateEventPayload["layout"]["seat"] = {};

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const prevId = value.layout[r]?.[c] ?? null;
        if (prevId) {
          nextLayout[r][c] = prevId;
          const seatInfo = value.seat[prevId];
          if (seatInfo) nextSeat[prevId] = seatInfo;
        }
      }
    }
    onChange({ layout: nextLayout, seat: nextSeat });
  }, [rows, cols]);

  const grid = useMemo<SeatCell[][]>(() => {
    return value.layout.map((row) =>
      row.map((id) => ({ id, grade: id ? value.seat[id]?.grade ?? "A" : null }))
    );
  }, [value]);

  const toggleSeat = useCallback(
    (r: number, c: number) => {
      const matrix = value.layout.map((row) => [...row]);
      const seatMap = { ...value.seat } as typeof value.seat;

      const currentId = matrix[r][c];
      if (currentId) {
        matrix[r][c] = null;
        delete seatMap[currentId];
      } else {
        if (overLimit) return;

        const newId = `${String.fromCharCode(65 + r)}${c + 1}`;
        matrix[r][c] = newId;
        seatMap[newId] = { grade: "A" };
      }
      onChange({ layout: matrix, seat: seatMap });
    },

    [value, overLimit]
  );

  const changeGrade = useCallback(
    (id: string, grade: SeatGrade) => {
      onChange({ ...value, seat: { ...value.seat, [id]: { grade } } });
    },
    [onChange, value]
  );

  return (
    <div className="grid gap-2">
      <Label>좌석 그리드</Label>

      <div className="flex gap-2">
        <Input
          type="number"
          min={1}
          value={rowInput}
          onChange={(e) => setRowInput(e.target.value)}
          className={`w-20 ${overLimit ? "border-destructive" : ""}`}
          placeholder="행"
        />
        <span className="self-center text-sm">rows ×</span>
        <Input
          type="number"
          min={1}
          value={colInput}
          onChange={(e) => setColInput(e.target.value)}
          className={`w-20 ${overLimit ? "border-destructive" : ""}`}
          placeholder="열"
        />
        <span className="self-center text-sm">cols</span>
      </div>

      {overLimit && (
        <p className="text-xs text-destructive">
          {`현재 격자(${cellTotal}석)가 총 좌석 수(${seatCount}석)를 초과했습니다.`}
        </p>
      )}

      {rows > 0 && cols > 0 && (
        <div className="overflow-auto border rounded">
          <table className="border-collapse select-none">
            <tbody>
              {grid.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={`${r}-${c}`}
                      className={`w-10 h-10 border text-center align-middle p-0 cursor-pointer ${
                        cell.id ? "bg-primary/10" : "bg-muted/40"
                      }`}
                      onClick={() => toggleSeat(r, c)}
                    >
                      {cell.id && (
                        <Select
                          value={cell.grade ?? "A"}
                          onValueChange={(g) =>
                            changeGrade(cell.id!, g as SeatGrade)
                          }
                        >
                          <SelectTrigger className="h-10 w-10 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {seatGrades.map((g) => (
                              <SelectItem key={g} value={g} className="text-xs">
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface SeatCell {
  id: string | null;
  grade: SeatGrade | null;
}
