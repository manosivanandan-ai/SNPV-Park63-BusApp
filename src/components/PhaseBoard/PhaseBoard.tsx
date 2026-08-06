import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { StudentCard } from "@/components/StudentCard";
import { Summary } from "@/components/Summary";
import { fireConfetti } from "@/utils/confetti";
import { cn } from "@/utils/cn";
import type { Phase, Student } from "@/types";

interface PhaseBoardProps {
  phase: Phase;
  students: Student[];
  onToggleBoarded: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, phase: Phase) => void;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

export function PhaseBoard({ students, onToggleBoarded, onRename, onMove, onDelete, isReadOnly }: PhaseBoardProps) {
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
    setFlashedId(id);
    setTimeout(() => {
      onToggleBoarded(id);
      setFlashedId(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-4">
      <Summary boarded={boardedCount} total={total} />

      {/* Quick-tap chips — tap a name to mark as boarded */}
      <div className="rounded-3xl border-2 border-peach-100 bg-peach-50/60 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-peach-400">
          {isReadOnly ? "Not yet boarded" : "Tap to mark as boarded"}
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
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: flashedId === s.id ? "#4ade80" : undefined,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => !isReadOnly && handleChipTap(s.id)}
                  disabled={isReadOnly}
                  className={cn(
                    "rounded-full bg-white border-2 border-peach-200 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors",
                    isReadOnly
                      ? "cursor-default opacity-80"
                      : "hover:border-mint-300 hover:bg-mint-50 hover:text-mint-700 active:scale-95"
                  )}
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
                onToggleBoarded={onToggleBoarded}
                onRename={onRename}
                onMove={onMove}
                onDelete={onDelete}
                isReadOnly={isReadOnly}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
