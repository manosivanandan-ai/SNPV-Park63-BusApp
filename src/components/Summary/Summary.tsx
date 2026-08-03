import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

interface SummaryProps {
  boarded: number;
  total: number;
}

function StatBlock({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.span
        key={value}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`font-heading text-2xl font-black sm:text-3xl ${colorClass}`}
      >
        {value}
      </motion.span>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export function Summary({ boarded, total }: SummaryProps) {
  const remaining = total - boarded;

  return (
    <Card className="p-5">
      <div className="mb-4 grid grid-cols-3 divide-x divide-lavender-100">
        <StatBlock label="Boarded" value={boarded} colorClass="text-mint-500" />
        <StatBlock label="Remaining" value={remaining} colorClass="text-peach-500" />
        <StatBlock label="Total" value={total} colorClass="text-lavender-500" />
      </div>
      <ProgressBar value={boarded} max={total} />
      <p className="mt-2 text-center text-sm font-semibold text-slate-500">
        {boarded} of {total} Boarded
      </p>
    </Card>
  );
}
