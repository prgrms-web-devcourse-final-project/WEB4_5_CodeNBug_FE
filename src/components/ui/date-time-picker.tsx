import { Label } from "@radix-ui/react-label";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { useEffect, useId, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";

interface DateTimePickerProps {
  label: string;
  value?: Date;
  onChange: (d?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  defaultTime?: string;
  disabled?: boolean;
  required?: boolean;
}

const mergeDateTime = (date: Date, timeStr: string) => {
  const [h, m] = timeStr.split(":" as const).map(Number);
  const next = new Date(date);
  next.setHours(h);
  next.setMinutes(m);
  next.setSeconds(0);
  next.setMilliseconds(0);
  return next;
};

export const DateTimePicker = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  defaultTime = "19:00",
  disabled = false,
  required = false,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(() =>
    value ? format(value, "HH:mm") : defaultTime
  );
  const controlId = useId();

  useEffect(() => {
    if (value) setTime(format(value, "HH:mm"));
  }, [value]);

  const handleDate = (d?: Date) => {
    if (!d) return;
    const merged = mergeDateTime(d, time);
    onChange(merged);
    setOpen(false);
  };

  const handleTime = (t: string) => {
    setTime(t);
    if (!t.match(/^\d{2}:\d{2}$/)) return;
    const base = value ?? new Date();
    onChange(mergeDateTime(base, t));
  };

  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={controlId}
        className={
          required
            ? "after:content-['*'] after:ml-0.5 after:text-destructive"
            : ""
        }
      >
        {label}
      </Label>

      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={controlId}
            variant="outline"
            disabled={disabled}
            className="justify-start w-full"
            aria-label={label}
          >
            {value ? format(value, "yyyy-MM-dd HH:mm") : "날짜/시간 선택"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDate}
            locale={ko}
            initialFocus
            {...(minDate ? { fromDate: minDate } : {})}
            {...(maxDate ? { toDate: maxDate } : {})}
          />

          <div className="p-3 border-t grid gap-2">
            <Label htmlFor={`${controlId}-time`} className="text-xs">
              시간
            </Label>
            <Input
              id={`${controlId}-time`}
              type="time"
              step={300}
              value={time}
              onChange={(e) => handleTime(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
