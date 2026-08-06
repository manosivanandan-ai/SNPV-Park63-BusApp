import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const provider = new GoogleAuthProvider();
const ADMINS_REF = doc(db, "config", "admins");

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // null = still loading; [] = no admins yet (bootstrap); [...] = list
  const [allowedEmails, setAllowedEmails] = useState<string[] | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    return onSnapshot(ADMINS_REF, (snap) => {
      setAllowedEmails(snap.exists() ? (snap.data().emails as string[]) : []);
    });
  }, []);

  const loading = authLoading || allowedEmails === null;
  const isBootstrap = allowedEmails !== null && allowedEmails.length === 0;
  const isAdmin =
    !loading &&
    user !== null &&
    (isBootstrap || allowedEmails!.includes(user.email ?? ""));

  const signIn = () => signInWithPopup(auth, provider);
  const signOut = () => fbSignOut(auth);

  const claimAdmin = async () => {
    if (!user?.email) return;
    await setDoc(ADMINS_REF, { emails: [user.email] });
  };

  const updateAllowedEmails = async (emails: string[]) => {
    await setDoc(ADMINS_REF, { emails });
  };

  return {
    user,
    loading,
    isAdmin,
    isBootstrap,
    allowedEmails: allowedEmails ?? [],
    signIn,
    signOut,
    claimAdmin,
    updateAllowedEmails,
  };
}
