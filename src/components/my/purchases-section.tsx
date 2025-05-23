import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MySkeleton } from "@/components/loading/my.loading";
import { useMyPurchases } from "@/services/query/user.query";
import { cn } from "@/lib/utils";
import { PurchaseDetailDrawer } from "./purchase-detail-drawer";

export const PurchasesSection = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useMyPurchases(page);

  if (isLoading) return <MySkeleton />;

  if (isError || !data)
    return (
      <p className="py-8 text-center text-sm text-red-500">
        구매 내역을 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()} className="underline">
          다시 시도
        </button>
      </p>
    );

  if (data.purchases.length === 0)
    return <p className="py-8 text-center text-sm">구매 내역이 없습니다.</p>;

  return (
    <>
      <motion.section
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {data.purchases.map((p) => (
          <Card
            key={p.purchaseId}
            className={cn(
              "flex flex-col bg-card border dark:border-gray-700",
              "hover:-translate-y-1 hover:shadow-lg transition-transform"
            )}
          >
            <CardHeader className="text-lg font-semibold flex flex-col gap-1">
              <span>{p.itemName}</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {new Date(p.purchaseDate).toLocaleDateString("ko-KR")}
              </span>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                결제 금액: {p.amount.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                결제 수단: {p.paymentMethod}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                상태: {p.paymentStatus}
              </p>
            </CardContent>
            <CardFooter>
              <PurchaseDetailDrawer purchaseId={p.purchaseId} page={page} />
            </CardFooter>
          </Card>
        ))}
      </motion.section>
      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={data.hasPrevious === false}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          이전
        </Button>
        <span className="text-sm self-center">
          {data.currentPage + 1} / {data.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={data.hasNext === false}
          onClick={() => setPage((p) => p + 1)}
        >
          다음
        </Button>
      </div>
    </>
  );
};
