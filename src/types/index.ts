export type Phase = "phase1" | "phase2";

export interface Student {
  id: string;
  name: string;
  phase: Phase;
  boarded: boolean;
}

export type BusStatusValue = "phase1" | "phase2" | "left";

export interface BusStatusOption {
  value: BusStatusValue;
  label: string;
  emoji: string;
  colorClass: string;
  activeClass: string;
}

export interface Driver {
  name: string;
  phone: string;
}
