import { useSearchParams, Link } from "react-router";
import { XCircle } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export const PaymentFailPage = () => {
  const [params] = useSearchParams();
  const message = params.get("message") ?? "결제가 실패하거나 취소되었습니다.";

  return (
    <motion.section
      className="container mx-auto flex flex-col items-center py-20 gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <XCircle className="h-20 w-20 text-rose-500" />
      <h1 className="text-2xl font-bold">결제 실패</h1>
      <p className="text-muted-foreground text-center max-w-xs">{message}</p>
      <Button asChild size="lg">
        <Link to="/">다시 시도하기</Link>
      </Button>
    </motion.section>
  );
};

export default PaymentFailPage;
