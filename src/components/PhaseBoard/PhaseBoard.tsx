import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { StudentCard } from "@/components/StudentCard";
import { Summary } from "@/components/Summary";
import { fireConfetti } from "@/utils/confetti";
import type { Phase, Student } from "@/types";

interface PhaseBoardProps {
  phase: Phase;
  students: Student[];
  onToggleBoarded: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, phase: Phase) => void;
  onDelete: (id: string) => void;
}

export function PhaseBoard({ students, onToggleBoarded, onRename, onMove, onDelete }: PhaseBoardProps) {
  const [query, setQuery] = useState("");
  const celebratedRef = useRef(false);

  const boardedCount = students.filter((s) => s.boarded).length;
  const total = students.length;
  const allBoarded = total > 0 && boardedCount === total;

  useEffect(() => {
    if (allBoarded && !celebratedRef.current) {
      celebratedRef.current = true;
      fireConfetti();
    }
    if (!allBoarded) {
      celebratedRef.current = false;
    }
  }, [allBoarded]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, query]);

  const remaining = useMemo(() => students.filter((s) => !s.boarded), [students]);

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={query} onChange={setQuery} placeholder="Search children by name..." />

      <Summary boarded={boardedCount} total={total} />

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
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2">
        <h3 className="mb-2 font-heading text-base font-bold text-slate-600">
          🕒 Children Yet to Board
        </h3>
        {remaining.length === 0 ? (
          <p className="rounded-2xl bg-mint-50 px-4 py-3 text-sm font-semibold text-mint-600">
            Nobody left — all boarded! 🎉
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {remaining.map((s) => (
                <motion.span
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-full bg-peach-100 px-3 py-1.5 text-sm font-semibold text-peach-600"
                >
                  {s.name}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
