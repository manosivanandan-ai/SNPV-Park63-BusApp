import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { INITIAL_DRIVER } from "@/data/initialData";
import type { Driver } from "@/types";

const REF = doc(db, "config", "driver");

export function useDriver() {
  const [driver, setDriverState] = useState<Driver>(INITIAL_DRIVER);

  useEffect(() => {
    const unsub = onSnapshot(REF, (snap) => {
      if (snap.exists()) {
        setDriverState(snap.data() as Driver);
      } else {
        setDoc(REF, INITIAL_DRIVER);
      }
    });
    return unsub;
  }, []);

  const setDriver = (driver: Driver) => {
    setDriverState(driver);
    setDoc(REF, driver);
  };

  return { driver, setDriver };
}
