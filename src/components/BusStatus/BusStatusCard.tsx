import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUS_STATUS_OPTIONS } from "@/data/initialData";
import type { BusStatusValue } from "@/types";
import { cn } from "@/utils/cn";

interface BusStatusCardProps {
  status: BusStatusValue;
  onChange: (status: BusStatusValue) => void;
  isReadOnly?: boolean;
}

export function BusStatusCard({ status, onChange, isReadOnly }: BusStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {BUS_STATUS_OPTIONS.map((option) => {
            const active = option.value === status;
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => !isReadOnly && onChange(option.value)}
                disabled={isReadOnly}
                whileTap={isReadOnly ? {} : { scale: 0.96 }}
                className={cn(
                  "relative flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-sm font-heading font-bold transition-colors",
                  active ? option.activeClass : cn(option.colorClass, "hover:brightness-95"),
                  isReadOnly && "cursor-not-allowed opacity-70"
                )}
              >
                <span className="text-lg">{option.emoji}</span>
                <span>{option.label.replace("Bus is in ", "").replace("Bus left the community", "Left")}</span>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
