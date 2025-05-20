import { CreateEventPayload } from "@/schemas/manager.schema";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DateTimePicker } from "../ui/date-time-picker";
import { SeatLayoutBuilder } from "./seat-layout-builder";
import { Separator } from "../ui/separator";
import { PriceListEditor } from "./price-list-editor";
import { EventCategory } from "@/schemas/event.schema";
import { ThumbnailField } from "./thumbnail-field";

const BasicStep = () => {
  const { register, formState } = useFormContext<CreateEventPayload>();
  const { errors } = formState;
  const eventTypes: { label: string; value: EventCategory }[] = [
    { label: "뮤지컬", value: "MUSICAL" },
    { label: "콘서트", value: "CONCERT" },
    { label: "전시", value: "EXHIBITION" },
    { label: "팬미팅", value: "FAN_MEETING" },
    { label: "스포츠", value: "SPORTS" },
    { label: "기타", value: "ETC" },
  ] as const;

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-xs text-destructive" role="alert">
              {errors.title.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>카테고리 *</Label>
          <Select defaultValue="MUSICAL" {...register("category")}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">설명 *</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <ThumbnailField />
    </div>
  );
};

const ScheduleStep = () => {
  const { control, watch } = useFormContext<CreateEventPayload>();

  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const bookingStart = watch("bookingStart");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="시작 일시 *"
            value={field.value}
            onChange={field.onChange}
            minDate={today}
            maxDate={endDate}
            required
          />
        )}
      />
      <Controller
        name="endDate"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="종료 일시 *"
            value={field.value}
            onChange={field.onChange}
            minDate={startDate ?? today}
            required
          />
        )}
      />
      <Controller
        name="bookingStart"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="예매 시작 *"
            value={field.value}
            onChange={field.onChange}
            minDate={today}
            maxDate={startDate}
            required
          />
        )}
      />
      <Controller
        name="bookingEnd"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="예매 종료 *"
            value={field.value}
            onChange={field.onChange}
            minDate={bookingStart ?? today}
            maxDate={startDate}
            required
          />
        )}
      />
    </div>
  );
};

const SeatPriceStep = () => {
  const { register, control, watch, setValue } =
    useFormContext<CreateEventPayload>();

  const seatCount = watch("seatCount");
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="location">공연장 *</Label>
          <Input id="location" {...register("location")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hallName">홀 이름 *</Label>
          <Input id="hallName" {...register("hallName")} />
        </div>
        <div className="grid gap-2">
          <Label>총 좌석 수 *</Label>
          <Input
            type="number"
            min={1}
            {...register("seatCount", { valueAsNumber: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label>관람 가능 연령 *</Label>
          <Input
            type="number"
            min={0}
            {...register("agelimit", { valueAsNumber: true })}
          />
        </div>
      </div>

      <SeatLayoutBuilder
        seatCount={seatCount}
        value={watch("layout")}
        onChange={(v) => setValue("layout", v, { shouldDirty: true })}
      />
      <Separator />
      <PriceListEditor control={control} />
    </div>
  );
};

const ReviewStep = () => {
  const { watch } = useFormContext<CreateEventPayload>();
  const data = watch();
  return (
    <pre className="bg-muted/50 p-4 rounded text-xs overflow-auto max-h-72">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export const stepsArr = [BasicStep, ScheduleStep, SeatPriceStep, ReviewStep];
