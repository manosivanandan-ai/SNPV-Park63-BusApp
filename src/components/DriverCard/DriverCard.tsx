import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Phone, User, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Driver } from "@/types";

interface DriverCardProps {
  driver: Driver;
  onSave: (driver: Driver) => void;
}

export function DriverCard({ driver, onSave }: DriverCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(driver.name);
  const [phone, setPhone] = useState(driver.phone);

  const startEdit = () => {
    setName(driver.name);
    setPhone(driver.phone);
    setEditing(true);
  };

  const save = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) return;
    onSave({ name: trimmedName, phone: trimmedPhone });
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">🚍 Driver Information</CardTitle>
        {!editing && (
          <Button size="sm" variant="outline" onClick={startEdit}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="driver-name">Driver Name</Label>
                <Input
                  id="driver-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Driver name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="driver-phone">Phone Number</Label>
                <Input
                  id="driver-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  inputMode="tel"
                />
              </div>
              <div className="mt-1 flex gap-2">
                <Button variant="mint" size="sm" onClick={save} className="flex-1">
                  <Check className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="flex-1">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-500">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Driver Name
                  </p>
                  <p className="font-heading text-base font-bold text-slate-700">{driver.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-mint-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </p>
                  <p className="font-heading text-base font-bold text-slate-700">{driver.phone}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
