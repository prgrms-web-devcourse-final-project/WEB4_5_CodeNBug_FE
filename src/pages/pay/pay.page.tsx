import { motion } from "motion/react";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import {
  loadTossPayments,
  type TossPaymentsPayment,
} from "@tosspayments/tosspayments-sdk";
import { Ticket, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/payment.store";
import { initialPayments } from "@/services/pay.service";
import { createOrderId } from "@/lib/utils";
import { useMyInfo } from "@/services/query/user.query";

export const EventPayPage = () => {
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

  const { data: myInfo } = useMyInfo();

  const { mutate: initPay, isPending: preparing } = useMutation({
    mutationFn: () => initialPayments(eventId!, amount, eventAuthToken!),
    onSuccess: ({ data }) => {
      closeQueue?.();
      const id = data.data!.purchaseId;
      const oid = createOrderId(id);
      setPaymentInfo({ purchaseId: id, orderId: oid });
      setPurchaseId(id);
      toast.success("결제 준비가 완료되었습니다.");
    },
    onError: (e) =>
      toast.error(
        (e as Error)?.message ?? "결제 준비에 실패했습니다. 다시 시도해 주세요."
      ),
  });

  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [payment, setPayment] = useState<TossPaymentsPayment | null>(null);
  const ready = !!payment;

  useEffect(() => {
    if (!purchaseId) return;

    (async () => {
      try {
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY!;
        const customerKey = localStorage.getItem("tossCustomerKey") || uuidv4();
        localStorage.setItem("tossCustomerKey", customerKey);

        const toss = await loadTossPayments(clientKey);
        setPayment(toss.payment({ customerKey }));
      } catch {
        toast.error("토스 결제창 초기화에 실패했습니다.");
      }
    })();

    return () => setPayment(null);
  }, [purchaseId]);

  useLayoutEffect(() => {
    if (!eventId || seatList.length === 0) nav(-1);
  }, [eventId, seatList, nav]);

  const handleRequestPayment = () => {
    if (!payment || !orderId) return;

    payment.requestPayment({
      method: "CARD",
      amount: { value: amount, currency: "KRW" },
      orderId,
      orderName: `예매 ${purchaseId}`,
      successUrl: `${location.origin}/payments/success`,
      failUrl: `${location.origin}/payments/fail`,
      customerName: myInfo?.name,
      customerEmail: myInfo?.email,
      card: { flowMode: "DEFAULT" },
    });
  };

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
              좌석&nbsp;{id}
            </li>
          ))}
        </ul>
        <p className="text-base font-medium">
          총 결제 금액:&nbsp;
          <span className="text-xl font-bold">{amount.toLocaleString()}원</span>
        </p>
      </div>

      <Separator />

      {!purchaseId && (
        <Button
          size="lg"
          variant="outline"
          className="w-full flex items-center gap-2"
          disabled={preparing}
          onClick={() => initPay()}
        >
          {preparing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              결제 준비 중…
            </>
          ) : (
            <>
              <Ticket size={18} />
              결제 준비하기
            </>
          )}
        </Button>
      )}

      {purchaseId && (
        <Button
          size="lg"
          className="w-full flex items-center gap-2"
          disabled={!ready}
          onClick={handleRequestPayment}
        >
          <Ticket size={18} />
          {ready ? "결제하기" : "결제창 불러오는 중…"}
        </Button>
      )}

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
