import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { INITIAL_BUS_STATUS } from "@/data/initialData";
import type { BusStatusValue } from "@/types";

const REF = doc(db, "config", "busStatus");

export function useBusStatus() {
  const [status, setStatusState] = useState<BusStatusValue>(INITIAL_BUS_STATUS);

  useEffect(() => {
    const unsub = onSnapshot(REF, (snap) => {
      if (snap.exists()) {
        setStatusState(snap.data().value as BusStatusValue);
      } else {
        setDoc(REF, { value: INITIAL_BUS_STATUS });
      }
    });
    return unsub;
  }, []);

  const setStatus = (value: BusStatusValue) => {
    setStatusState(value);
    setDoc(REF, { value });
  };

  return { status, setStatus };
}
