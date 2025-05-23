import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useManagerRefund } from "@/services/query/manager.query";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query/query-key";

interface Props {
  eventId: number;
  purchaseId: number;
}

export const ManagerRefundDialog = ({ eventId, purchaseId }: Props) => {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const qc = useQueryClient();

  const { mutate, isPending } = useManagerRefund(purchaseId, eventId);

  const onRefund = () => {
    if (!reason.trim()) {
      toast.error("취소 사유를 입력해 주세요.");
      return;
    }

    mutate(
      {
        purchasesIds: [purchaseId],
        totalRefund: false,
        reason,
      },
      {
        onSuccess: () => {
          toast.success("환불 완료");
          qc.invalidateQueries({
            queryKey: QUERY_KEY.MANAGER.PURCHASE_LIST(eventId),
            type: "all",
          });
          setOpen(false);
          setReason("");
        },
        onError: () => toast.error("환불 실패"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">환불</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>환불 사유 입력</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="예: 고객 요청"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={onRefund} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
