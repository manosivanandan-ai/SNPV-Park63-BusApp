import type { Student, Driver, BusStatusOption, BusStatusValue } from "@/types";

let idCounter = 0;
const nextId = () => `student-${Date.now()}-${idCounter++}`;

export const INITIAL_STUDENTS: Student[] = [
  ...[
    "Vihaan.G",
    "Rithvik.G",
    "Aadhya",
    "Yashashwini",
    "Vibodh",
    "ThukilOviyan",
    "Sarvesh",
    "Lakshaya",
    "Varshitha",
    "Aadhvika",
    "Rithvin",
    "Neelesh",
  ].map((name): Student => ({ id: nextId(), name, phase: "phase1", boarded: false })),
  ...[
    "Kirtanyaa",
    "Yokshita",
    "Magizhnan",
    "Navilnan",
    "Tanmaya",
    "Siddharth Nair",
    "Ayush",
    "Shravya",
    "Humsiha",
    "Sandhya",
    "Ilakkiya A",
    "Riddhan",
    "Cholamithran",
    "Cholavarman",
    "Arjun",
    "Dharmik",
    "Tara",
    "Nila G",
    "Kavishree",
    "Niranjan",
    "Anvika Shree",
  ].map((name): Student => ({ id: nextId(), name, phase: "phase2", boarded: false })),
];

export const INITIAL_DRIVER: Driver = {
  name: "Bus Driver",
  phone: "9876543210",
};

export const INITIAL_BUS_STATUS: BusStatusValue = "phase1";

export const BUS_STATUS_OPTIONS: BusStatusOption[] = [
  {
    value: "phase1",
    label: "Bus is in Phase 1",
    emoji: "🟢",
    colorClass: "bg-mint-100 text-mint-700 border-mint-200",
    activeClass: "bg-mint-400 text-white border-mint-400 shadow-glow",
  },
  {
    value: "phase2",
    label: "Bus is in Phase 2",
    emoji: "🟡",
    colorClass: "bg-peach-100 text-peach-700 border-peach-200",
    activeClass: "bg-peach-400 text-white border-peach-400 shadow-glow",
  },
  {
    value: "left",
    label: "Bus left the community",
    emoji: "🔵",
    colorClass: "bg-sky-100 text-sky-700 border-sky-200",
    activeClass: "bg-sky-400 text-white border-sky-400 shadow-glow",
  },
];

export const PHASE_LABEL: Record<"phase1" | "phase2", string> = {
  phase1: "Phase 1",
  phase2: "Phase 2",
};
