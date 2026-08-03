import { motion } from "framer-motion";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardProps {
  total: number;
  boarded: number;
}

const stats = [
  { key: "total", label: "Total Children", icon: Users, bg: "bg-lavender-100", fg: "text-lavender-500" },
  { key: "boarded", label: "Boarded", icon: CheckCircle2, bg: "bg-mint-100", fg: "text-mint-500" },
  { key: "remaining", label: "Remaining", icon: Clock, bg: "bg-peach-100", fg: "text-peach-500" },
] as const;

export function Dashboard({ total, boarded }: DashboardProps) {
  const remaining = total - boarded;
  const values: Record<string, number> = { total, boarded, remaining };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex flex-col items-center gap-1.5 p-3 text-center sm:gap-2 sm:p-5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11 ${stat.bg}`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.fg}`} />
              </div>
              <motion.span
                key={values[stat.key]}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-heading text-xl font-black text-slate-700 sm:text-3xl"
              >
                {values[stat.key]}
              </motion.span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                {stat.label}
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
