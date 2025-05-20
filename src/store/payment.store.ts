import { create } from "zustand";

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

export const usePaymentStore = create<PaymentState>((set) => ({
  seatList: [],
  amount: 0,
  setPaymentInfo: (info) => set((prev) => ({ ...prev, ...info })),
  reset: () =>
    set({
      eventId: undefined,
      seatList: [],
      amount: 0,
      orderId: undefined,
      eventAuthToken: undefined,
      purchaseId: undefined,
      closeQueue: undefined,
    }),
}));
