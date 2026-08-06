import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LOCK_REF = doc(db, "config", "sessionLock");
const LOCK_TTL = 3 * 60 * 1000; // 3 minutes
const HEARTBEAT_MS = 60 * 1000; // 60 seconds

interface LockData {
  deviceId: string;
  lastActiveAt: number;
}

function getDeviceId(): string {
  const key = "bus-tracker:deviceId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(key, id);
  }
  return id;
}

function writeLock(deviceId: string) {
  return setDoc(LOCK_REF, { deviceId, lastActiveAt: Date.now() });
}

export function useSessionLock() {
  const [lockData, setLockData] = useState<LockData | null>(null);
  const [lockLoaded, setLockLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  const deviceId = useRef(getDeviceId());
  const lockDataRef = useRef<LockData | null>(null);

  // Subscribe to lock document
  useEffect(() => {
    return onSnapshot(LOCK_REF, (snap) => {
      const data = snap.exists() ? (snap.data() as LockData) : null;
      lockDataRef.current = data;
      setLockData(data);
      setLockLoaded(true);
    });
  }, []);

  // Re-evaluate expiry every 30 seconds so UI updates without a manual refresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Acquire lock once we know the current state
  useEffect(() => {
    if (!lockLoaded) return;
    const l = lockDataRef.current;
    const expired = !l || Date.now() - l.lastActiveAt > LOCK_TTL;
    const mine = l?.deviceId === deviceId.current;
    if (expired || mine) writeLock(deviceId.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockLoaded]);

  // Heartbeat — keep the lock alive while this tab is open
  useEffect(() => {
    const id = setInterval(() => {
      const l = lockDataRef.current;
      if (l?.deviceId === deviceId.current) writeLock(deviceId.current);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, []);

  // Release lock when tab closes
  useEffect(() => {
    const handler = () => {
      if (lockDataRef.current?.deviceId === deviceId.current) deleteDoc(LOCK_REF);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  void tick; // drives periodic re-render for expiry check

  const lockExpired = lockData ? Date.now() - lockData.lastActiveAt > LOCK_TTL : true;
  const isMine = lockData?.deviceId === deviceId.current;
  const lockedByOther = !!lockData && !isMine && !lockExpired;
  const expiredByOther = !!lockData && !isMine && lockExpired;

  const takeControl = () => writeLock(deviceId.current);

  return { lockedByOther, expiredByOther, takeControl };
}
