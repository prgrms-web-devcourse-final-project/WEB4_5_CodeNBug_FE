// src/components/manager/event-purchases-drawer.tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { format } from "date-fns";
import { useManagerPurchases } from "@/services/query/manager.query";
import { ManagerRefundDialog } from "./manager-refund-dialog";

interface Props {
  eventId: number;
}

export const EventPurchasesDrawer = ({ eventId }: Props) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useManagerPurchases(
    open ? eventId : null
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          구매 내역
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4">
        <DrawerHeader className="p-0 mb-4">
          <DrawerTitle>구매 내역 (이벤트 #{eventId})</DrawerTitle>
        </DrawerHeader>

        {isLoading && (
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-sm text-red-500">
            리스트를 불러오지 못했습니다.{" "}
            <button className="underline" onClick={() => refetch()}>
              다시 시도
            </button>
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {data?.length === 0 ? (
              <p className="text-center text-sm py-6">구매 내역이 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>구매자</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>전화</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>일시</TableHead>
                    <TableHead>티켓</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((p) => (
                    <TableRow key={p.purchaseId} className="h-12">
                      <TableCell>{p.purchaseId}</TableCell>
                      <TableCell>{p.userName}</TableCell>
                      <TableCell>{p.userEmail}</TableCell>
                      <TableCell>{p.phoneNum}</TableCell>
                      <TableCell>{p.amount.toLocaleString()}원</TableCell>
                      <TableCell>{p.payment_status}</TableCell>
                      <TableCell>
                        {format(p.purchaseAt, "yyyy-MM-dd HH:mm")}
                      </TableCell>
                      <TableCell>{p.ticket_id.join(", ")}</TableCell>
                      <TableCell>{p.ticket_id.join(", ")}</TableCell>
                      <TableCell>
                        {p.payment_status === "DONE" && (
                          <ManagerRefundDialog
                            eventId={eventId}
                            purchaseId={p.purchaseId}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}

        <DrawerClose asChild>
          <Button variant="outline" className="w-full mt-6">
            닫기
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};
