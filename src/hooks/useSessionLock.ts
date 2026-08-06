import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

const LOCK_REF = doc(db, "config", "sessionLock");
const LOCK_TTL = 3 * 60 * 1000; // 3 minutes
const HEARTBEAT_MS = 60 * 1000; // 60 seconds

export interface LockData {
  uid: string;
  displayName: string;
  email: string;
  lastActiveAt: number;
}

function writeLock(user: User) {
  return setDoc(LOCK_REF, {
    uid: user.uid,
    displayName: user.displayName ?? user.email ?? "Someone",
    email: user.email ?? "",
    lastActiveAt: Date.now(),
  });
}

export function useSessionLock(user: User | null, isAdmin: boolean) {
  const [lockData, setLockData] = useState<LockData | null>(null);
  const [lockLoaded, setLockLoaded] = useState(false);
  // tick forces re-evaluation of lock expiry every 30s even without Firestore changes
  const [tick, setTick] = useState(0);

  const lockDataRef = useRef<LockData | null>(null);
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // Subscribe to lock document
  useEffect(() => {
    return onSnapshot(LOCK_REF, (snap) => {
      const data = snap.exists() ? (snap.data() as LockData) : null;
      lockDataRef.current = data;
      setLockData(data);
      setLockLoaded(true);
    });
  }, []);

  // Re-evaluate expiry every 30 seconds so "Take control" appears without a full refresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Acquire lock once snapshot is loaded (if available or expired)
  useEffect(() => {
    if (!isAdmin || !user || !lockLoaded) return;
    const l = lockDataRef.current;
    const expired = !l || Date.now() - l.lastActiveAt > LOCK_TTL;
    const mine = l?.uid === user.uid;
    if (expired || mine) writeLock(user);
  // Only run when lockLoaded first flips; user/isAdmin covered by outer guard
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockLoaded]);

  // Heartbeat — keeps the lock alive while the app is open
  useEffect(() => {
    if (!isAdmin) return;
    const id = setInterval(() => {
      const u = userRef.current;
      const l = lockDataRef.current;
      if (u && l?.uid === u.uid) writeLock(u);
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [isAdmin]);

  // Release lock when tab closes
  useEffect(() => {
    const handler = () => {
      const u = userRef.current;
      const l = lockDataRef.current;
      if (u && l?.uid === u.uid) deleteDoc(LOCK_REF);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const lockExpired = lockData ? Date.now() - lockData.lastActiveAt > LOCK_TTL : true;
  const isMine = lockData?.uid === user?.uid;
  const lockedByOther = !!lockData && !isMine && !lockExpired;
  const expiredByOther = !!lockData && !isMine && lockExpired;

  const takeControl = () => {
    if (user) writeLock(user);
  };

  // suppress unused tick warning — it just drives re-render
  void tick;

  return { lockData, isMine, lockedByOther, expiredByOther, takeControl };
}
