import { useCallback, useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { INITIAL_STUDENTS } from "@/data/initialData";
import type { Phase, Student } from "@/types";

const REF = doc(db, "config", "students");

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<Student[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(REF, (snap) => {
      if (snap.exists()) {
        const list = snap.data().list as Student[];
        ref.current = list;
        setStudents(list);
      } else {
        ref.current = INITIAL_STUDENTS;
        setDoc(REF, { list: INITIAL_STUDENTS });
      }
      setLoaded(true);
    });
    return unsub;
  }, []);

  const persist = useCallback((list: Student[]) => {
    ref.current = list;
    setStudents(list);
    setDoc(REF, { list });
  }, []);

  const addStudent = useCallback(
    (name: string, phase: Phase) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      persist([
        ...ref.current,
        {
          id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: trimmed,
          phase,
          boarded: false,
        },
      ]);
    },
    [persist]
  );

  const toggleBoarded = useCallback(
    (id: string) => {
      persist(ref.current.map((s) => (s.id === id ? { ...s, boarded: !s.boarded } : s)));
    },
    [persist]
  );

  const renameStudent = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      persist(ref.current.map((s) => (s.id === id ? { ...s, name: trimmed } : s)));
    },
    [persist]
  );

  const moveStudent = useCallback(
    (id: string, phase: Phase) => {
      persist(ref.current.map((s) => (s.id === id ? { ...s, phase } : s)));
    },
    [persist]
  );

  const deleteStudent = useCallback(
    (id: string) => {
      persist(ref.current.filter((s) => s.id !== id));
    },
    [persist]
  );

  const bulkImport = useCallback(
    (phase1Names: string[], phase2Names: string[], replace: boolean) => {
      const make = (name: string, phase: Phase): Student => ({
        id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        phase,
        boarded: false,
      });
      const incoming = [
        ...phase1Names.map((n) => make(n, "phase1")),
        ...phase2Names.map((n) => make(n, "phase2")),
      ];
      persist(replace ? incoming : [...ref.current, ...incoming]);
    },
    [persist]
  );

  return { students, loaded, addStudent, toggleBoarded, renameStudent, moveStudent, deleteStudent, bulkImport };
}
