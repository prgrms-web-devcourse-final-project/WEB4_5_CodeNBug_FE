import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
  CreateEventPayload,
  CreateEventPayloadSchema,
} from "@/schemas/manager.schema";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { SeatLayoutBuilder } from "@/components/manager/seat-layout-builder";
import { PriceListEditor } from "@/components/manager/price-list-editor";

const eventTypes = [
  { label: "뮤지컬", value: "MUSICAL" },
  { label: "콘서트", value: "CONCERT" },
] as const;

interface EditInitial {
  eventId: number;
  title: string;
  type: string;
  thumbnailUrl: string;
  startDate: string;
  endDate: string;
  location: string;
  hallName: string;
  status: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateEventPayload) => void;
  initial?: EditInitial | null;
}

export const EventCreateDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: Props) => {
  const methods = useForm<CreateEventPayload>({
    resolver: zodResolver(CreateEventPayloadSchema),
    defaultValues: {
      title: "",
      type: "MUSICAL",
      description: "",
      thumbnailUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      hallName: "",
      seatCount: 10,
      layout: {
        layout: [
          [null, null, null, null, null],
          [null, null, null, null, null],
        ],
        seat: {},
      },
      price: [{ grade: "A", amount: "" }],
      bookingStart: new Date(),
      bookingEnd: new Date(),
      agelimit: 0,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = methods;

  useEffect(() => {
    if (initial && open) {
      reset((prev) => ({
        ...prev,
        title: initial.title,
        type: initial.type ?? "MUSICAL",
        thumbnailUrl: initial.thumbnailUrl,
        startDate: new Date(initial.startDate),
        endDate: new Date(initial.endDate),
        location: initial.location,
        hallName: initial.hallName,
      }));
    }
    if (!initial && open) reset();
  }, [initial, open, reset]);

  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const bookingStart = watch("bookingStart");
  const bookingEnd = watch("bookingEnd");

  return (
    <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial ? "행사 수정" : "행사 생성"}</DialogTitle>
          <DialogDescription>
            필수 정보를 입력하고 저장하세요.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((values) => {
              const payload: CreateEventPayload = {
                ...values,
                startDate: new Date(values.startDate),
                endDate: new Date(values.endDate),
                bookingStart: new Date(values.bookingStart),
                bookingEnd: new Date(values.bookingEnd),
              };
              onSubmit(payload);
            })}
            className="grid gap-6 py-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>제목 *</Label>
                <Input {...register("title")} />
                {typeof errors.title?.message === "string" && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>타입 *</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>설명 *</Label>
              <Textarea rows={3} {...register("description")} />
            </div>

            <div className="grid gap-2">
              <Label>썸네일 URL *</Label>
              <Input {...register("thumbnailUrl")} />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DateTimePicker
                    label="시작 일시 *"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={today}
                    maxDate={endDate}
                  />
                )}
              />

              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DateTimePicker
                    label="종료 일시 *"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={startDate ?? today}
                  />
                )}
              />

              <Controller
                control={control}
                name="bookingStart"
                render={({ field }) => (
                  <DateTimePicker
                    label="예매 시작 *"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={today}
                    maxDate={bookingEnd ?? startDate}
                  />
                )}
              />

              <Controller
                control={control}
                name="bookingEnd"
                render={({ field }) => (
                  <DateTimePicker
                    label="예매 종료 *"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={bookingStart ?? today}
                    maxDate={startDate}
                  />
                )}
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>공연장 *</Label>
                <Input {...register("location")} />
              </div>
              <div className="grid gap-2">
                <Label>홀 이름 *</Label>
                <Input {...register("hallName")} />
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

            <Separator />

            <Controller
              control={control}
              name="layout"
              render={({ field }) => (
                <SeatLayoutBuilder
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Separator />

            <PriceListEditor control={control} />

            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {initial ? "수정 저장" : "생성"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
