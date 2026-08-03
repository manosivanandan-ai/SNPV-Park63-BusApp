import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_STUDENTS } from "@/data/initialData";
import type { Phase, Student } from "@/types";

const STORAGE_KEY = "bus-tracker:students";

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

  return { students, addStudent, toggleBoarded, renameStudent, moveStudent, deleteStudent };
}
