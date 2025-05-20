"use client";
import { useLayoutEffect, useEffect, useRef, useState, useId } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { Ticket } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/payment.store";
import { initialPayments } from "@/services/pay.service";
import { createOrderId } from "@/lib/utils";

const EventPayPage = () => {
  const widgetId = useId();
  const agreementId = useId();

  const nav = useNavigate();
  const {
    eventId,
    seatList,
    amount,
    eventAuthToken,
    closeQueue,
    reset,
    setPaymentInfo,
    orderId,
  } = usePaymentStore();

  const { mutate: initPay, isPending } = useMutation({
    mutationFn: () => initialPayments(eventId!, amount, eventAuthToken!),
    onSuccess: ({ data }) => {
      closeQueue?.();

      if (data.data) {
        const id = data.data.purchaseId;
        const oid = createOrderId(id);

        setPurchaseId(id);
        setPaymentInfo({ purchaseId: id, orderId: oid });

        toast.success("결제 위젯을 불러옵니다.");
      }
    },
    onError: (err) =>
      toast.error(
        (err as Error)?.message ??
          "결제 초기화에 실패했습니다. 다시 시도해 주세요."
      ),
  });

  const widgetRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const paymentWidget = useRef<PaymentWidgetInstance>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    if (!purchaseId) return;

    const load = async () => {
      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
      if (!clientKey) {
        toast.error("Toss 클라이언트 키가 설정되지 않았습니다.");
        return;
      }
      const customerKey = localStorage.getItem("tossCustomerKey") || uuidv4();
      localStorage.setItem("tossCustomerKey", customerKey);

      paymentWidget.current = await loadPaymentWidget(clientKey, customerKey);

      paymentWidget.current!.renderPaymentMethods(
        `#${widgetId}`,
        { value: amount },
        { variantKey: "DEFAULT" }
      );

      await paymentWidget.current.renderAgreement(`#${agreementId}`);

      setWidgetReady(true);
    };

    load().catch(() => toast.error("토스 결제위젯을 로드하지 못했습니다."));

    return () => {
      setWidgetReady(false);
      paymentWidget.current = null;
    };
  }, [purchaseId, amount, widgetId, agreementId]);

  const handleRequestPayment = () => {
    const widget = paymentWidget.current;
    if (!widget || !orderId) return;

    widget.requestPayment({
      orderId: orderId,
      orderName: `공연 예매 ${purchaseId}`,
      successUrl: `${location.origin}/payments/success`,
      failUrl: `${location.origin}/payments/fail`,
    });
  };

  useLayoutEffect(() => {
    if (!eventId || seatList.length === 0) nav(-1);
  }, [eventId, seatList, nav]);

  if (!eventId) return null;

  return (
    <motion.section
      className="container mx-auto px-4 py-10 flex flex-col gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1 className="text-2xl font-bold">결제 정보 확인</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">선택 좌석</h2>
        <ul className="flex flex-wrap gap-2">
          {seatList.map((id) => (
            <li
              key={id}
              className="px-2 py-1 rounded bg-primary/10 text-sm font-medium"
            >
              좌석 ID&nbsp;{id}
            </li>
          ))}
        </ul>
        <p className="text-base font-medium">
          총 결제 금액:&nbsp;
          <span className="text-xl font-bold">{amount.toLocaleString()}원</span>
        </p>
      </div>

      <Separator />

      <div id={widgetId} ref={widgetRef} />
      <div id={agreementId} ref={agreementRef} className="mt-4" />

      <Button
        size="lg"
        className="w-full flex items-center gap-2"
        disabled={isPending || (purchaseId !== null && !widgetReady)}
        onClick={purchaseId ? handleRequestPayment : () => initPay()}
      >
        <Ticket size={18} />
        {isPending ? "결제 준비 중…" : purchaseId ? "결제하기" : "결제 초기화"}
      </Button>

      <Button
        variant="ghost"
        className="mt-2"
        onClick={() => {
          reset();
          nav(-1);
        }}
      >
        이전 단계로
      </Button>
    </motion.section>
  );
};

export default EventPayPage;
