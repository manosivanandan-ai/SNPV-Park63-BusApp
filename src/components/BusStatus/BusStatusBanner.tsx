import { AnimatePresence, motion } from "framer-motion";
import { BUS_STATUS_OPTIONS } from "@/data/initialData";
import type { BusStatusValue } from "@/types";
import { cn } from "@/utils/cn";

const BANNER_STYLES: Record<BusStatusValue, string> = {
  phase1: "bg-gradient-to-r from-mint-400 to-mint-500 text-white",
  phase2: "bg-gradient-to-r from-peach-400 to-peach-500 text-white",
  left: "bg-gradient-to-r from-sky-400 to-sky-500 text-white",
};

const BANNER_TEXT: Record<BusStatusValue, string> = {
  phase1: "Bus currently in Phase 1",
  phase2: "Bus currently in Phase 2",
  left: "Bus left the community",
};

export function BusStatusBanner({ status }: { status: BusStatusValue }) {
  const option = BUS_STATUS_OPTIONS.find((o) => o.value === status)!;

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={cn(
            "mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-2xl py-3 px-5 text-center font-heading text-base font-bold shadow-soft sm:text-lg",
            BANNER_STYLES[status]
          )}
        >
          <span className="text-xl">{option.emoji}</span>
          <span>{BANNER_TEXT[status]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
