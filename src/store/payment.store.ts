import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PaymentState = {
  eventId?: string;
  seatList: number[];
  amount: number;
  eventAuthToken?: string;
  purchaseId?: number;
  orderId?: string;
  closeQueue?: () => void;
  setPaymentInfo: (
    info: Partial<Omit<PaymentState, "setPaymentInfo" | "reset">>
  ) => void;
  reset: () => void;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      seatList: [],
      amount: 0,

      setPaymentInfo: (info) => set((prev) => ({ ...prev, ...info })),

      reset: () =>
        set({
          eventId: undefined,
          seatList: [],
          amount: 0,
          eventAuthToken: undefined,
          purchaseId: undefined,
          orderId: undefined,
          closeQueue: undefined,
        }),
    }),
    {
      name: "payment-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        eventId: state.eventId,
        seatList: state.seatList,
        amount: state.amount,
        eventAuthToken: state.eventAuthToken,
        purchaseId: state.purchaseId,
        orderId: state.orderId,
      }),
    }
  )
);
