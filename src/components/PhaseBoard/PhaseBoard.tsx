import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, PartyPopper } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { StudentCard } from "@/components/StudentCard";
import { Summary } from "@/components/Summary";
import { fireConfetti } from "@/utils/confetti";
import { PHASE_LABEL } from "@/data/initialData";
import type { BusStatusValue, Phase, Student } from "@/types";
import { cn } from "@/utils/cn";

interface PhaseBoardProps {
  phase: Phase;
  students: Student[];
  busStatus: BusStatusValue;
  onToggleBoarded: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, phase: Phase) => void;
  onDelete: (id: string) => void;
}

export function PhaseBoard({ phase, students, busStatus, onToggleBoarded, onRename, onMove, onDelete }: PhaseBoardProps) {
  const canMark = busStatus === phase;
  const [query, setQuery] = useState("");
  const [flashedId, setFlashedId] = useState<string | null>(null);
  const celebratedRef = useRef(false);

  const boardedCount = students.filter((s) => s.boarded).length;
  const total = students.length;
  const allBoarded = total > 0 && boardedCount === total;
  const unboarded = useMemo(() => students.filter((s) => !s.boarded), [students]);

  useEffect(() => {
    if (allBoarded && !celebratedRef.current) {
      celebratedRef.current = true;
      fireConfetti();
    }
    if (!allBoarded) celebratedRef.current = false;
  }, [allBoarded]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, query]);

  const handleChipTap = (id: string) => {
    if (!canMark) return;
    setFlashedId(id);
    setTimeout(() => {
      onToggleBoarded(id);
      setFlashedId(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-4">
      <Summary boarded={boardedCount} total={total} />

      {!canMark && (
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
          <Lock className="h-4 w-4 shrink-0" />
          Marking opens once the bus is in {PHASE_LABEL[phase]}
        </div>
      )}

      {/* Quick-tap chips — tap a name to mark as boarded */}
      <div
        className={cn(
          "rounded-3xl border-2 border-peach-100 bg-peach-50/60 p-4 transition-opacity",
          !canMark && "opacity-60"
        )}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-peach-400">
          Tap to mark as boarded
        </p>
        {unboarded.length === 0 ? (
          <p className="text-sm font-semibold text-mint-600">🎉 Everyone has boarded!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {unboarded.map((s) => (
                <motion.button
                  key={s.id}
                  layout
                  disabled={!canMark}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: flashedId === s.id ? "#4ade80" : undefined,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleChipTap(s.id)}
                  className="rounded-full bg-white border-2 border-peach-200 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:border-mint-300 hover:bg-mint-50 hover:text-mint-700 active:scale-95 transition-colors disabled:pointer-events-none disabled:hover:border-peach-200 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed"
                >
                  {s.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {allBoarded && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-mint-100 to-sky-100 py-3 font-heading font-bold text-mint-700"
          >
            <PartyPopper className="h-5 w-5" />
            Everyone's boarded! Great job!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full card list for reference / undo */}
      <SearchBar value={query} onChange={setQuery} placeholder="Search children by name..." />
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-slate-400"
            >
              No children found 🔍
            </motion.p>
          ) : (
            filtered.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                canMark={canMark}
                onToggleBoarded={onToggleBoarded}
                onRename={onRename}
                onMove={onMove}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
