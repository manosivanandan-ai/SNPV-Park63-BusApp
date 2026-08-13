import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Phase } from "@/types";

const REF = doc(db, "config", "activity");
const ACTIVE_WINDOW_MS = 2500;

export function useMarkingActivity() {
  const [lastPhase, setLastPhase] = useState<Phase | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const unsub = onSnapshot(REF, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setLastPhase(data.phase as Phase);
      setLastUpdatedAt(data.updatedAt as number);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  const activePhase =
    lastPhase && lastUpdatedAt !== null && now - lastUpdatedAt < ACTIVE_WINDOW_MS ? lastPhase : null;

  return { activePhase };
}

export function pingMarkingActivity(phase: Phase) {
  setDoc(REF, { phase, updatedAt: Date.now() });
}
