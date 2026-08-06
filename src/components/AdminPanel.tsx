import { useState } from "react";
import { X, Plus, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserEmail: string;
  allowedEmails: string[];
  onUpdateEmails: (emails: string[]) => Promise<void>;
}

export function AdminPanel({ open, onOpenChange, currentUserEmail, allowedEmails, onUpdateEmails }: Props) {
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || allowedEmails.includes(email)) return;
    setSaving(true);
    await onUpdateEmails([...allowedEmails, email]);
    setNewEmail("");
    setSaving(false);
  };

  const remove = async (email: string) => {
    if (email === currentUserEmail) return; // can't remove yourself
    await onUpdateEmails(allowedEmails.filter((e) => e !== email));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") add();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-lavender-500" />
            Admin Access
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-400">
            Only the Google accounts listed below can sign in. You cannot remove your own account.
          </p>

          {/* Add email */}
          <div className="flex gap-2">
            <Input
              placeholder="parent@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 text-sm"
              inputMode="email"
              autoCapitalize="none"
            />
            <Button size="sm" variant="mint" onClick={add} disabled={saving || !newEmail.trim()}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Email list */}
          <div className="flex flex-col gap-2">
            {allowedEmails.length === 0 && (
              <p className="text-center text-xs text-slate-400">No admins configured yet.</p>
            )}
            {allowedEmails.map((email) => {
              const isYou = email === currentUserEmail;
              return (
                <div
                  key={email}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-lavender-600 text-xs font-bold">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate text-sm font-medium text-slate-700">{email}</span>
                    {isYou && (
                      <span className="shrink-0 rounded-full bg-lavender-100 px-2 py-0.5 text-xs font-semibold text-lavender-600">
                        you
                      </span>
                    )}
                  </div>
                  {!isYou && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0 text-slate-400 hover:text-red-500"
                      onClick={() => remove(email)}
                      aria-label={`Remove ${email}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
