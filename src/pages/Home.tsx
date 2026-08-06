import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bus, Users2, RotateCcw, ShieldCheck, LogOut, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusStatusBanner, BusStatusCard } from "@/components/BusStatus";
import { DriverCard } from "@/components/DriverCard";
import { Dashboard } from "@/components/Dashboard";
import { PhaseBoard } from "@/components/PhaseBoard";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { ManageRosterDialog } from "@/components/ManageRosterDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginPage } from "@/components/LoginPage";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/useStudents";
import { useDriver } from "@/hooks/useDriver";
import { useBusStatus } from "@/hooks/useBusStatus";
import { useAuth } from "@/hooks/useAuth";
import { useSessionLock } from "@/hooks/useSessionLock";
import type { Phase } from "@/types";

export default function Home() {
  const { user, loading: authLoading, isAdmin, isBootstrap, allowedEmails, signIn, signOut, claimAdmin, updateAllowedEmails } = useAuth();
  const { students, loaded, addStudent, toggleBoarded, renameStudent, moveStudent, deleteStudent, bulkImport, resetAttendance } =
    useStudents();
  const { driver, setDriver } = useDriver();
  const { status, setStatus } = useBusStatus();
  const { lockData, lockedByOther, expiredByOther, takeControl } = useSessionLock(user, isAdmin);

  const [tab, setTab] = useState<Phase>("phase2");
  const [addOpen, setAddOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const isReadOnly = lockedByOther;

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm font-semibold text-slate-400">Loading…</p>
      </div>
    );
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <LoginPage
        error={signInError}
        onSignIn={async () => {
          setSignInError(null);
          try {
            await signIn();
          } catch {
            setSignInError("Sign-in failed. Please try again.");
          }
        }}
      />
    );
  }

  // ── Bootstrap: no admins configured yet ──────────────────────────────────
  if (isBootstrap) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl">🔐</span>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-black text-slate-700">Set up admin access</h2>
          <p className="max-w-xs text-sm text-slate-400">
            No admins have been configured yet. Claim admin access to get started. Future admins can be added from the app.
          </p>
          <p className="text-xs text-slate-400">Signed in as <span className="font-semibold text-slate-600">{user.email}</span></p>
        </div>
        <div className="flex gap-3">
          <Button variant="mint" onClick={claimAdmin}>
            <ShieldCheck className="h-4 w-4" />
            Claim Admin Access
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  // ── Signed in but not on the allowlist ───────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl">🚫</span>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-black text-slate-700">Access denied</h2>
          <p className="max-w-xs text-sm text-slate-400">
            Your account (<span className="font-semibold text-slate-600">{user.email}</span>) hasn't been added as an admin. Ask an existing admin to add your email.
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  // ── Roster loading ────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm font-semibold text-slate-400">Loading roster…</p>
      </div>
    );
  }

  const phase1Students = students.filter((s) => s.phase === "phase1");
  const phase2Students = students.filter((s) => s.phase === "phase2");
  const totalBoarded = students.filter((s) => s.boarded).length;

  return (
    <div className="min-h-screen pb-28">
      <BusStatusBanner status={status} />

      {/* Session lock banner */}
      {(lockedByOther || expiredByOther) && (
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-peach-50 px-4 py-2.5 border-b border-peach-200">
          <div className="flex items-center gap-2 min-w-0">
            <Lock className="h-4 w-4 shrink-0 text-peach-500" />
            <p className="truncate text-sm font-semibold text-peach-700">
              {lockedByOther
                ? `${lockData?.displayName ?? "Someone"} is using the app — editing paused`
                : `${lockData?.displayName ?? "Someone"}'s session expired`}
            </p>
          </div>
          {expiredByOther && (
            <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={takeControl}>
              Take control
            </Button>
          )}
        </div>
      )}

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pt-5 sm:px-6">
        <header className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ rotate: -8 }}
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl sm:text-4xl"
            >
              🚌
            </motion.span>
            <h1 className="font-heading text-2xl font-black text-slate-700 sm:text-3xl">
              School Bus Boarding Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-400">Keep every little rider safe & accounted for</p>

          {/* Action buttons */}
          {!isReadOnly && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setRosterOpen(true)}>
                <Users2 className="h-3.5 w-3.5" />
                Manage Roster
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-peach-600 border-peach-200 hover:bg-peach-50"
                onClick={() => setResetOpen(true)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New Day
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-lavender-600 border-lavender-200 hover:bg-lavender-50" onClick={() => setAdminOpen(true)}>
                <ShieldCheck className="h-3.5 w-3.5" />
                Admins
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400" onClick={signOut}>
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          )}
          {isReadOnly && (
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400" onClick={signOut}>
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          )}
        </header>

        <Dashboard total={students.length} boarded={totalBoarded} />

        <BusStatusCard status={status} onChange={setStatus} isReadOnly={isReadOnly} />

        <DriverCard driver={driver} onSave={setDriver} isReadOnly={isReadOnly} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as Phase)} className="flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="phase2">Phase 2</TabsTrigger>
            <TabsTrigger value="phase1">Phase 1</TabsTrigger>
          </TabsList>

          <TabsContent value="phase2">
            <PhaseBoard
              phase="phase2"
              students={phase2Students}
              onToggleBoarded={toggleBoarded}
              onRename={renameStudent}
              onMove={moveStudent}
              onDelete={deleteStudent}
              isReadOnly={isReadOnly}
            />
          </TabsContent>
          <TabsContent value="phase1">
            <PhaseBoard
              phase="phase1"
              students={phase1Students}
              onToggleBoarded={toggleBoarded}
              onRename={renameStudent}
              onMove={moveStudent}
              onDelete={deleteStudent}
              isReadOnly={isReadOnly}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* FAB — hidden in read-only mode */}
      {!isReadOnly && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
        >
          <Button size="fab" onClick={() => setAddOpen(true)} aria-label="Add student" className="shadow-glow">
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </Button>
        </motion.div>
      )}

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} defaultPhase={tab} onAdd={addStudent} />

      <ManageRosterDialog open={rosterOpen} onOpenChange={setRosterOpen} onImport={bulkImport} />

      <AdminPanel
        open={adminOpen}
        onOpenChange={setAdminOpen}
        currentUserEmail={user.email ?? ""}
        allowedEmails={allowedEmails}
        onUpdateEmails={updateAllowedEmails}
      />

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Start a new day?"
        description="This will mark all children as Not Boarded and reset the bus to Phase 2. Their names stay — only attendance is cleared."
        confirmLabel="Reset Attendance"
        onConfirm={() => {
          resetAttendance();
          setStatus("phase2");
        }}
      />

      <footer className="mt-10 flex items-center justify-center gap-1.5 pb-4 text-xs text-slate-300">
        <Bus className="h-3.5 w-3.5" />
        Made with care for safe rides home
      </footer>
    </div>
  );
}
