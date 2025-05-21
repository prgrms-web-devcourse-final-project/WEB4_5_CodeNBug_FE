import { ResInitialPaymentsSchemaType } from "@/schemas/pay.schema";
import { axiosInstance } from "./api";

export const initialPayments = async (
  eventId: string,
  amount: number,
  entryAuthToken: string
) => {
  return await axiosInstance.post<ResInitialPaymentsSchemaType>(
    `/payments/init`,
    {
      eventId: +eventId,
      amount,
    },
    { headers: { entryAuthToken } }
  );
};

export const confirmPayment = async ({
  purchaseId,
  paymentKey,
  orderId,
  amount,
  entryAuthToken,
}: {
  purchaseId: number;
  paymentKey: string;
  orderId: string;
  amount: number;
  entryAuthToken: string;
}) =>
  axiosInstance.post(
    "/payments/confirm",
    { purchaseId, paymentKey, orderId, amount },
    { headers: { entryAuthToken } }
  );
