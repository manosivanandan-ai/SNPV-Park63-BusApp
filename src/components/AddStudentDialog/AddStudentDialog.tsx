import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PHASE_LABEL } from "@/data/initialData";
import type { Phase } from "@/types";
import { cn } from "@/utils/cn";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPhase: Phase;
  onAdd: (name: string, phase: Phase) => void;
}

export function AddStudentDialog({ open, onOpenChange, defaultPhase, onAdd }: AddStudentDialogProps) {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>(defaultPhase);

  useEffect(() => {
    if (open) {
      setName("");
      setPhase(defaultPhase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd(name, phase);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-lavender-500" />
            Add a Child
          </DialogTitle>
          <DialogDescription>Add a new student to a boarding phase.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="student-name">Student Name</Label>
            <Input
              id="student-name"
              placeholder="e.g. Ananya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Select Phase</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["phase1", "phase2"] as Phase[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className={cn(
                    "rounded-2xl border-2 px-4 py-3 text-sm font-heading font-bold transition-colors",
                    phase === p
                      ? "border-lavender-400 bg-lavender-100 text-lavender-600"
                      : "border-lavender-100 bg-white text-slate-500 hover:bg-lavender-50"
                  )}
                >
                  {PHASE_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
