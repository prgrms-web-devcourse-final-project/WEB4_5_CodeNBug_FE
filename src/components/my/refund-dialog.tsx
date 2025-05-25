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
import { useRefund } from "@/services/query/user.query";

interface Props {
  purchaseId: number;
  page: number;
  paymentKey: string;
}

export const RefundDialog = ({ paymentKey, purchaseId, page }: Props) => {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useRefund(purchaseId, paymentKey, page);

  const handleRefund = () => {
    if (!reason.trim()) {
      toast.error("취소 사유를 입력해 주세요.");
      return;
    }
    mutate(reason, {
      onSuccess: () => {
        toast.success("환불 요청이 접수되었습니다.");
        setReason("");
        setOpen(false);
      },
      onError: () => toast.error("환불 요청 실패"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          환불 요청
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>환불 사유를 입력하세요</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="예: 개인 사정으로 취소합니다."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={handleRefund} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
