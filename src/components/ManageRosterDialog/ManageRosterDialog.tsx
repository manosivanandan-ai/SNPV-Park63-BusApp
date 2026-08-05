import { useEffect, useState } from "react";
import { Users2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ManageRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (phase1Names: string[], phase2Names: string[], replace: boolean) => void;
}

function parseNames(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ManageRosterDialog({ open, onOpenChange, onImport }: ManageRosterDialogProps) {
  const [phase1Raw, setPhase1Raw] = useState("");
  const [phase2Raw, setPhase2Raw] = useState("");
  const [replace, setReplace] = useState(true);

  useEffect(() => {
    if (open) {
      setPhase1Raw("");
      setPhase2Raw("");
      setReplace(true);
    }
  }, [open]);

  const phase1Names = parseNames(phase1Raw);
  const phase2Names = parseNames(phase2Raw);
  const total = phase1Names.length + phase2Names.length;

  const handleImport = () => {
    if (total === 0) return;
    onImport(phase1Names, phase2Names, replace);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-lavender-500" />
            Manage Roster
          </DialogTitle>
          <DialogDescription>
            Paste student names — one per line — into each phase. Then choose whether to replace the
            existing list or add to it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Phase 1
                {phase1Names.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-mint-100 px-2 py-0.5 text-xs font-bold text-mint-600">
                    {phase1Names.length}
                  </span>
                )}
              </label>
              <textarea
                className="h-52 w-full resize-none rounded-2xl border-2 border-lavender-100 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-lavender-300 focus:outline-none focus:ring-0"
                placeholder={"Rithvik\nVihaan\nAadhya\n..."}
                value={phase1Raw}
                onChange={(e) => setPhase1Raw(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">
                Phase 2
                {phase2Names.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-peach-100 px-2 py-0.5 text-xs font-bold text-peach-600">
                    {phase2Names.length}
                  </span>
                )}
              </label>
              <textarea
                className="h-52 w-full resize-none rounded-2xl border-2 border-lavender-100 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-lavender-300 focus:outline-none focus:ring-0"
                placeholder={"Kirtanyaa\nHumsiha\nTanmayaa\n..."}
                value={phase2Raw}
                onChange={(e) => setPhase2Raw(e.target.value)}
              />
            </div>
          </div>

          {total > 0 && (
            <p className="text-center text-sm text-slate-500">
              Ready to import{" "}
              <span className="font-bold text-lavender-600">{total}</span> student
              {total !== 1 ? "s" : ""}
              {phase1Names.length > 0 && phase2Names.length > 0
                ? ` (${phase1Names.length} Phase 1, ${phase2Names.length} Phase 2)`
                : ""}
            </p>
          )}

          <div className="flex gap-2">
            {(["replace", "append"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setReplace(mode === "replace")}
                className={cn(
                  "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors",
                  (mode === "replace") === replace
                    ? "border-lavender-400 bg-lavender-100 text-lavender-600"
                    : "border-lavender-100 bg-white text-slate-400 hover:bg-lavender-50"
                )}
              >
                {mode === "replace" ? "Replace existing list" : "Add to existing list"}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={total === 0}>
            Import {total > 0 ? `${total} students` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
