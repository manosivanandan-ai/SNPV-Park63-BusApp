import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusStatusBanner, BusStatusCard } from "@/components/BusStatus";
import { DriverCard } from "@/components/DriverCard";
import { Dashboard } from "@/components/Dashboard";
import { PhaseBoard } from "@/components/PhaseBoard";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/useStudents";
import { useDriver } from "@/hooks/useDriver";
import { useBusStatus } from "@/hooks/useBusStatus";
import type { Phase } from "@/types";

export default function Home() {
  const { students, addStudent, toggleBoarded, renameStudent, moveStudent, deleteStudent } =
    useStudents();
  const { driver, setDriver } = useDriver();
  const { status, setStatus } = useBusStatus();

  const [tab, setTab] = useState<Phase>("phase1");
  const [addOpen, setAddOpen] = useState(false);

  const phase1Students = students.filter((s) => s.phase === "phase1");
  const phase2Students = students.filter((s) => s.phase === "phase2");
  const totalBoarded = students.filter((s) => s.boarded).length;

  return (
    <div className="min-h-screen pb-28">
      <BusStatusBanner status={status} />

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
        </header>

        <Dashboard total={students.length} boarded={totalBoarded} />

        <BusStatusCard status={status} onChange={setStatus} />

        <DriverCard driver={driver} onSave={setDriver} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as Phase)} className="flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="phase1">Phase 1</TabsTrigger>
            <TabsTrigger value="phase2">Phase 2</TabsTrigger>
          </TabsList>

          <TabsContent value="phase1">
            <PhaseBoard
              phase="phase1"
              students={phase1Students}
              onToggleBoarded={toggleBoarded}
              onRename={renameStudent}
              onMove={moveStudent}
              onDelete={deleteStudent}
            />
          </TabsContent>
          <TabsContent value="phase2">
            <PhaseBoard
              phase="phase2"
              students={phase2Students}
              onToggleBoarded={toggleBoarded}
              onRename={renameStudent}
              onMove={moveStudent}
              onDelete={deleteStudent}
            />
          </TabsContent>
        </Tabs>
      </main>

      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
      >
        <Button
          size="fab"
          onClick={() => setAddOpen(true)}
          aria-label="Add student"
          className="shadow-glow"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </Button>
      </motion.div>

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} defaultPhase={tab} onAdd={addStudent} />

      <footer className="mt-10 flex items-center justify-center gap-1.5 pb-4 text-xs text-slate-300">
        <Bus className="h-3.5 w-3.5" />
        Made with care for safe rides home
      </footer>
    </div>
  );
}
