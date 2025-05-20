import { Link } from "react-router";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export const PaymentCompletePage = () => (
  <motion.section
    className="container mx-auto flex flex-col items-center py-20 gap-6"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  >
    <CheckCircle className="h-20 w-20 text-emerald-500" />
    <h1 className="text-2xl font-bold">결제가 완료되었습니다!</h1>
    <p className="text-muted-foreground">
      마이페이지에서 예매 내역을 확인할 수 있습니다.
    </p>
    <Button asChild size="lg">
      <Link to="/">홈으로 가기</Link>
    </Button>
  </motion.section>
);

export default PaymentCompletePage;
