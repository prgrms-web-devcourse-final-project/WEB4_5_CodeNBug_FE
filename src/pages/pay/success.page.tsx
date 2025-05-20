import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { confirmPayment } from "@/services/pay.service";
import { usePaymentStore } from "@/store/payment.store";
import { toast } from "sonner";

export const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { purchaseId, eventAuthToken, reset } = usePaymentStore();

  const { mutate } = useMutation({
    mutationFn: () =>
      confirmPayment({
        purchaseId: purchaseId!,
        paymentKey: params.get("paymentKey")!,
        orderId: params.get("orderId")!,
        amount: Number(params.get("amount")!),
        entryAuthToken: eventAuthToken!,
      }),
    onSuccess: () => {
      toast.success("결제가 완료되었습니다.");
      nav("/payments/complete", { replace: true });
      reset();
    },
    onError: () => {
      nav("/payments/fail", { replace: true });
    },
  });

  useEffect(() => {
    if (!purchaseId || !eventAuthToken) {
      nav("/payments/fail", { replace: true });
      return;
    }
    mutate();
  }, [mutate, purchaseId, eventAuthToken, nav]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="text-sm text-muted-foreground">결제 승인 중…</p>
    </div>
  );
};

export default PaymentSuccessPage;
