import { motion } from "motion/react";
import { Loader2, CheckCircle2, AlertTriangle, LucideIcon } from "lucide-react";

type QueueStat = "IN_ENTRY" | "IN_PROGRESS" | "EXPIRED";

const STAT_META: Record<
  QueueStat,
  { color: string; label: string; Icon: LucideIcon }
> = {
  IN_ENTRY: {
    color: "text-yellow-500",
    label: "대기 중",
    Icon: Loader2,
  },
  IN_PROGRESS: {
    color: "text-emerald-600",
    label: "좌석 선택 가능",
    Icon: CheckCircle2,
  },
  EXPIRED: {
    color: "text-destructive",
    label: "세션 만료",
    Icon: AlertTriangle,
  },
};

export const QueueIndicator = ({ status }: { status: QueueStat }) => {
  const { color, label, Icon } = STAT_META[status];

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium"
    >
      <Icon
        size={16}
        className={`${color} ${
          status === "IN_ENTRY" && "animate-spin"
        } shrink-0`}
      />
      <span className={color}>{label}</span>
    </motion.div>
  );
};
