import { Control, Controller, useFieldArray } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreateEventPayload } from "@/schemas/manager.schema";
import { SeatGrade } from "@/schemas/seat.schema";

export const PriceListEditor = ({
  control,
}: {
  control: Control<CreateEventPayload>;
}) => {
  const { fields, append, remove } = useFieldArray({ name: "price", control });
  return (
    <div className="grid gap-2">
      <Label>좌석 등급별 가격 *</Label>
      {fields.map((field, idx) => (
        <div key={field.id} className="grid grid-cols-3 gap-2 items-center">
          <Controller
            name={`price.${idx}.grade` as const}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="등급" />
                </SelectTrigger>
                <SelectContent>
                  {SeatGrade.options.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name={`price.${idx}.amount` as const}
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="금액"
              />
            )}
          />
          <Button type="button" variant="ghost" onClick={() => remove(idx)}>
            삭제
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ grade: "A", amount: "" })}
      >
        + 등급 추가
      </Button>
    </div>
  );
};
