import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useMyPurchase } from "@/services/query/user.query";
import { useState } from "react";
import { RefundDialog } from "./refund-dialog";

interface Props {
  purchaseId: number;
  page: number;
}

export const PurchaseDetailDrawer = ({ purchaseId, page }: Props) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useMyPurchase(open ? purchaseId : null);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="w-full">
          상세 보기
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 space-y-4"
        >
          <DrawerHeader className="p-0">
            <DrawerTitle>구매 상세</DrawerTitle>
          </DrawerHeader>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}

          {isError && (
            <p className="text-center text-sm text-red-500">
              상세 정보를 불러오지 못했습니다.
            </p>
          )}
          {data && (
            <>
              <p className="text-sm">
                <span className="font-medium">상품명:</span> {data.itemName}
              </p>
              <p className="text-sm">
                <span className="font-medium">결제 금액:</span>{" "}
                {data.amount.toLocaleString()}원
              </p>
              <p className="text-sm">
                <span className="font-medium">결제 수단:</span>{" "}
                {data.paymentMethod}
              </p>
              <p className="text-sm">
                <span className="font-medium">상태:</span> {data.paymentStatus}
              </p>
              <p className="text-sm">
                <span className="font-medium">구매일:</span>{" "}
                {new Date(data.purchaseDate).toLocaleString("ko-KR")}
              </p>
              <p className="text-sm">
                <span className="font-medium">좌석:</span>{" "}
                {data.tickets.map((t) => t.seatLocation).join(", ")}
              </p>
              {data.paymentStatus === "DONE" && (
                <RefundDialog
                  paymentKey={data.paymentKey}
                  purchaseId={purchaseId}
                  page={page}
                />
              )}
            </>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </DrawerClose>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};
