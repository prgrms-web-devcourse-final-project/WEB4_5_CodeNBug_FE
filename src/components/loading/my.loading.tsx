import { motion } from "motion/react";

export const MySkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-6"
  >
    <div className="animate-pulse rounded-xl bg-muted/50 h-44" />
    <div className="animate-pulse rounded-xl bg-muted/50 h-80" />
  </motion.div>
);
