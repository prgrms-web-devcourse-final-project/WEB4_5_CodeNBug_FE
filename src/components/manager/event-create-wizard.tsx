import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useEffect, useState } from "react";

import {
  CreateEventPayload,
  CreateEventPayloadSchema,
  ResManagerEvent,
} from "@/schemas/manager.schema";
import { Stepper } from "@/components/ui/stepper";
import { stepsArr } from "./manager-step";

const stepLabels = ["기본", "일정", "좌석·가격", "검토"] as const;
const stepFieldMap: Record<number, (keyof CreateEventPayload)[]> = {
  0: ["title", "category", "description", "thumbnailUrl"],
  1: ["startDate", "endDate", "bookingStart", "bookingEnd"],
  2: ["location", "hallName", "seatCount", "agelimit", "layout", "price"],
  3: [],
};
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

interface EventCreateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateEventPayload) => void;
  initial?: ResManagerEvent["data"] | null;
}

export function EventCreateWizard({
  open,
  onOpenChange,
  onSubmit,
  initial,
}: EventCreateWizardProps) {
  const methods = useForm<CreateEventPayload>({
    resolver: zodResolver(CreateEventPayloadSchema),
    defaultValues: initial
      ? {
          description: "",
          seatCount: 10,
          layout: { layout: [[null]], seat: {} },
          price: [{ grade: "A", amount: "" }],
          bookingStart: new Date(),
          bookingEnd: new Date(),
          agelimit: 0,
          ...initial,
          startDate: new Date(initial?.startDate),
          endDate: new Date(initial?.endDate),
        }
      : {
          title: "",
          category: "MUSICAL",
          description: "",
          thumbnailUrl: "",
          startDate: new Date(),
          endDate: new Date(),
          location: "",
          hallName: "",
          seatCount: 10,
          layout: { layout: [[null]], seat: {} },
          price: [{ grade: "A", amount: "" }],
          bookingStart: new Date(),
          bookingEnd: new Date(),
          agelimit: 0,
        },
  });

  const { trigger, reset } = methods;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (open) {
      setActive(0);
      setDirection(1);
      reset(
        initial
          ? {
              description: "",
              seatCount: 10,
              layout: { layout: [[null]], seat: {} },
              price: [{ grade: "A", amount: "" }],
              bookingStart: new Date(),
              bookingEnd: new Date(),
              agelimit: 0,
              ...initial,
              startDate: new Date(initial?.startDate),
              endDate: new Date(initial?.endDate),
            }
          : methods.formState.defaultValues!
      );
    }
  }, [open]);

  const next = async () => {
    const fields = stepFieldMap[active];
    const valid = fields.length ? await trigger(fields) : true;
    if (!valid) return;
    setDirection(1);
    setActive((p) => Math.min(p + 1, stepsArr.length - 1));
  };
  const back = () => {
    setDirection(-1);
    setActive((p) => Math.max(p - 1, 0));
  };

  const onSubmitInternal = methods.handleSubmit((data) => {
    if (active < stepsArr.length - 1) {
      next();
    } else {
      onSubmit(data);
    }
  });

  const Step = stepsArr[active];

  return (
    <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial ? "행사 수정" : "행사 생성"}</DialogTitle>
          <DialogDescription>
            필수 정보를 입력하고 단계별로 진행하세요.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={onSubmitInternal} className="grid gap-6">
            <Stepper steps={Array.from(stepLabels)} active={active} />
            <div className="relative min-h-[320px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Step />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={active === 0}
              >
                이전
              </Button>
              {active < stepsArr.length - 1 ? (
                <Button type="button" onClick={next}>
                  다음 단계
                </Button>
              ) : (
                <Button type="submit">{initial ? "수정 저장" : "생성"}</Button>
              )}
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
