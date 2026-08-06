import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, ArrowLeftRight, Trash2, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditNameDialog } from "@/components/StudentCard/EditNameDialog";
import { PHASE_LABEL } from "@/data/initialData";
import type { Student } from "@/types";
import { cn } from "@/utils/cn";

const AVATAR_COLORS = [
  "bg-lavender-200 text-lavender-600",
  "bg-sky-200 text-sky-600",
  "bg-mint-200 text-mint-600",
  "bg-peach-200 text-peach-600",
];

function colorForName(name: string) {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

interface StudentCardProps {
  student: Student;
  onToggleBoarded: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, phase: Student["phase"]) => void;
  onDelete: (id: string) => void;
}

export function StudentCard({ student, onToggleBoarded, onRename, onMove, onDelete }: StudentCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const otherPhase = student.phase === "phase1" ? "phase2" : "phase1";

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
        <Card
          className={cn(
            "flex items-center gap-3 p-4 transition-colors duration-300 sm:gap-4 sm:p-5",
            student.boarded && "border-mint-200 bg-mint-50/80"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold sm:h-14 sm:w-14 sm:text-xl",
              colorForName(student.name)
            )}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base font-bold text-slate-700 sm:text-lg">
              {student.name}
            </p>
            <motion.div key={String(student.boarded)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant={student.boarded ? "boarded" : "pending"} className="mt-1">
                {student.boarded ? "✅ Boarded" : "❌ Not Boarded"}
              </Badge>
            </motion.div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <motion.div whileTap={{ scale: 0.94 }}>
              <Button
                size="sm"
                variant={student.boarded ? "outline" : "mint"}
                onClick={() => onToggleBoarded(student.id)}
                className="whitespace-nowrap"
              >
                {student.boarded ? (
                  <>
                    <Undo2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Undo</span>
                  </>
                ) : (
                  <span>Mark Present</span>
                )}
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More options">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit Name
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onMove(student.id, otherPhase)}>
                  <ArrowLeftRight className="h-4 w-4" />
                  Move to {PHASE_LABEL[otherPhase]}
                </DropdownMenuItem>
                <DropdownMenuItem destructive onSelect={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </motion.div>

      <EditNameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialName={student.name}
        onSave={(name) => onRename(student.id, name)}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${student.name}?`}
        description="This will remove the child from the boarding list. This action can't be undone."
        onConfirm={() => onDelete(student.id)}
      />
    </>
  );
}
