import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_STUDENTS } from "@/data/initialData";
import type { Phase, Student } from "@/types";

const STORAGE_KEY = "bus-tracker:students-v2";

export function useStudents() {
  const [students, setStudents] = useLocalStorage<Student[]>(STORAGE_KEY, INITIAL_STUDENTS);

  const addStudent = useCallback(
    (name: string, phase: Phase) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setStudents((prev) => [
        ...prev,
        { id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed, phase, boarded: false },
      ]);
    },
    [setStudents]
  );

  const toggleBoarded = useCallback(
    (id: string) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, boarded: !s.boarded } : s))
      );
    },
    [setStudents]
  );

  const renameStudent = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s)));
    },
    [setStudents]
  );

  const moveStudent = useCallback(
    (id: string, phase: Phase) => {
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, phase } : s)));
    },
    [setStudents]
  );

  const deleteStudent = useCallback(
    (id: string) => {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    },
    [setStudents]
  );

  const bulkImport = useCallback(
    (phase1Names: string[], phase2Names: string[], replace: boolean) => {
      const make = (name: string, phase: Phase) => ({
        id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        phase,
        boarded: false,
      });
      const incoming = [
        ...phase1Names.map((n) => make(n, "phase1")),
        ...phase2Names.map((n) => make(n, "phase2")),
      ];
      setStudents((prev) => (replace ? incoming : [...prev, ...incoming]));
    },
    [setStudents]
  );

  return { students, addStudent, toggleBoarded, renameStudent, moveStudent, deleteStudent, bulkImport };
}
