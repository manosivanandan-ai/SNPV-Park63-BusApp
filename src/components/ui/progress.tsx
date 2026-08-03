import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClassName?: string;
}

export function ProgressBar({ value, max, className, colorClassName }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={cn(
        "h-3 w-full overflow-hidden rounded-full bg-lavender-100",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-gradient-to-r from-mint-400 to-sky-400", colorClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
