import { useCallback, useState } from "react";
import { askGemma, type ChatMessage } from "@/lib/gemma";
import { BUS_STATUS_OPTIONS, PHASE_LABEL } from "@/data/initialData";
import type { Driver, BusStatusValue, Phase, Student } from "@/types";

interface GemmaAction {
  action?: string;
  name?: string;
  boarded?: boolean;
  phase?: string;
  status?: string;
  reply?: string;
}

function buildContext(students: Student[], status: BusStatusValue, driver: Driver): string {
  const roster = students.map(
    (s) => `${s.name} (${PHASE_LABEL[s.phase]}, ${s.boarded ? "boarded" : "not boarded"})`
  );

  return [
    "You are Agent 63, an assistant inside a school bus attendance app.",
    "Respond with EXACTLY ONE JSON object and nothing else. No markdown, no commentary outside the JSON.",
    "",
    "Valid JSON shapes:",
    '{"action":"mark_boarded","name":"<student name>","boarded":true}',
    '{"action":"mark_boarded","name":"<student name>","boarded":false}',
    '{"action":"add_student","name":"<new student name>","phase":"phase1"|"phase2"}',
    '{"action":"remove_student","name":"<student name>"}',
    '{"action":"set_bus_status","status":"phase1"|"phase2"|"left"}',
    '{"action":"answer","reply":"<plain text answer>"}',
    "",
    "Rules:",
    "- Use mark_boarded when the user says a student boarded, is present, is absent, or has not boarded.",
    "- Use add_student only when the user explicitly asks to add/create a new student.",
    "- Use remove_student only when the user explicitly asks to remove/delete a student.",
    "- If the user names someone, copy their name exactly as given in the \"name\" field, even if that name is not in the roster below — the app will check it.",
    "- Use answer for questions that do not change data (counts, who has/hasn't boarded, roster lookups, etc).",
    "- For answer, only ever mention names that appear verbatim in the roster list below. Never invent, guess, or reuse example names — if you are not sure, say you don't know.",
    "",
    "Examples:",
    'User: "Mark Aadhya as boarded" -> {"action":"mark_boarded","name":"Aadhya","boarded":true}',
    'User: "Riya has not boarded" -> {"action":"mark_boarded","name":"Riya","boarded":false}',
    'User: "Add a new student named Priya to phase 1" -> {"action":"add_student","name":"Priya","phase":"phase1"}',
    'User: "Remove Bob from the roster" -> {"action":"remove_student","name":"Bob"}',
    'User: "Set the bus status to left" -> {"action":"set_bus_status","status":"left"}',
    'User: "What color is the bus?" -> {"action":"answer","reply":"I don\'t have that information."}',
    "",
    `Bus status: ${status}.`,
    `Driver: ${driver.name} (${driver.phone}).`,
    "Roster:",
    ...roster,
  ].join("\n");
}

function extractJson(text: string): GemmaAction | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as GemmaAction;
  } catch {
    return null;
  }
}

type StudentMatch = Student | "ambiguous" | null;

function findStudent(students: Student[], rawName: string): StudentMatch {
  const q = rawName.trim().toLowerCase();
  if (!q) return null;

  const exact = students.filter((s) => s.name.toLowerCase() === q);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return "ambiguous";

  const partial = students.filter(
    (s) => s.name.toLowerCase().includes(q) || q.includes(s.name.toLowerCase())
  );
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) return "ambiguous";

  return null;
}

function busStatusLabel(value: BusStatusValue): string {
  return BUS_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// Handles the most common factual questions directly from the real roster data,
// so answers to them never depend on the model reading the list correctly.
function localAnswer(students: Student[], rawQuery: string): string | null {
  const q = rawQuery.toLowerCase();

  const asksNotBoarded = /who\b.{0,20}(hasn'?t|haven'?t|has not|have not|isn'?t|is not|not)\b.{0,10}board/.test(q);
  const asksBoarded = !asksNotBoarded && /who\b.{0,20}(has|have|is|are)\b.{0,10}board/.test(q);

  if (asksNotBoarded) {
    const names = students.filter((s) => !s.boarded).map((s) => s.name);
    return names.length === 0 ? "Everyone has boarded." : `Not boarded: ${names.join(", ")}.`;
  }
  if (asksBoarded) {
    const names = students.filter((s) => s.boarded).map((s) => s.name);
    return names.length === 0 ? "No one has boarded yet." : `Boarded: ${names.join(", ")}.`;
  }

  if (/how many/.test(q)) {
    const phase1 = students.filter((s) => s.phase === "phase1");
    const phase2 = students.filter((s) => s.phase === "phase2");
    const asksPhase1 = /phase\s*1/.test(q);
    const asksPhase2 = /phase\s*2/.test(q);
    const asksBoardedCount = /board/.test(q);

    if (asksPhase1) {
      return asksBoardedCount
        ? `${phase1.filter((s) => s.boarded).length} of ${phase1.length} in Phase 1 have boarded.`
        : `There are ${phase1.length} students in Phase 1.`;
    }
    if (asksPhase2) {
      return asksBoardedCount
        ? `${phase2.filter((s) => s.boarded).length} of ${phase2.length} in Phase 2 have boarded.`
        : `There are ${phase2.length} students in Phase 2.`;
    }
    if (asksBoardedCount) {
      const boarded = students.filter((s) => s.boarded).length;
      return `${boarded} of ${students.length} students have boarded.`;
    }
    if (/(total|student|kid|child)/.test(q)) {
      return `There are ${students.length} students total.`;
    }
  }

  return null;
}

interface Actions {
  onToggleBoarded: (id: string) => void;
  onAddStudent: (name: string, phase: Phase) => void;
  onRemoveStudent: (id: string) => void;
  onSetStatus: (value: BusStatusValue) => void;
  defaultPhase: Phase;
}

export function useGemmaChat(
  students: Student[],
  status: BusStatusValue,
  driver: Driver,
  actions: Actions
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setMessages((m) => [...m, { role: "user", content: trimmed }]);
      setError(null);

      const direct = localAnswer(students, trimmed);
      if (direct !== null) {
        setMessages((m) => [...m, { role: "assistant", content: direct }]);
        return;
      }

      setLoading(true);

      try {
        const context = buildContext(students, status, driver);
        const raw = await askGemma(context, [{ role: "user", content: trimmed }]);
        const parsed = extractJson(raw);

        let resultText: string;

        if (!parsed || !parsed.action) {
          resultText = raw;
        } else {
          switch (parsed.action) {
            case "mark_boarded": {
              const found = findStudent(students, parsed.name ?? "");
              if (found === null) {
                resultText = `There's no student named "${parsed.name}" on the roster.`;
              } else if (found === "ambiguous") {
                resultText = `I found more than one match for "${parsed.name}" — can you be more specific?`;
              } else {
                const desired = !!parsed.boarded;
                if (found.boarded === desired) {
                  resultText = `${found.name} is already marked as ${desired ? "boarded" : "not boarded"}.`;
                } else {
                  actions.onToggleBoarded(found.id);
                  resultText = `Marked ${found.name} as ${desired ? "boarded" : "not boarded"}.`;
                }
              }
              break;
            }
            case "add_student": {
              const name = (parsed.name ?? "").trim();
              if (!name) {
                resultText = "I need a name to add a student.";
              } else {
                const dup = students.find((s) => s.name.toLowerCase() === name.toLowerCase());
                if (dup) {
                  resultText = `${dup.name} is already on the roster.`;
                } else {
                  const phase: Phase =
                    parsed.phase === "phase1" || parsed.phase === "phase2"
                      ? parsed.phase
                      : actions.defaultPhase;
                  actions.onAddStudent(name, phase);
                  resultText = `Added ${name} to ${PHASE_LABEL[phase]}.`;
                }
              }
              break;
            }
            case "remove_student": {
              const found = findStudent(students, parsed.name ?? "");
              if (found === null) {
                resultText = `There's no student named "${parsed.name}" on the roster.`;
              } else if (found === "ambiguous") {
                resultText = `I found more than one match for "${parsed.name}" — can you be more specific?`;
              } else {
                actions.onRemoveStudent(found.id);
                resultText = `Removed ${found.name} from the roster.`;
              }
              break;
            }
            case "set_bus_status": {
              if (
                parsed.status === "phase1" ||
                parsed.status === "phase2" ||
                parsed.status === "left"
              ) {
                actions.onSetStatus(parsed.status);
                resultText = `Bus status set to: ${busStatusLabel(parsed.status)}.`;
              } else {
                resultText = "I didn't understand that bus status.";
              }
              break;
            }
            case "answer":
            default: {
              resultText = typeof parsed.reply === "string" ? parsed.reply : raw;
              break;
            }
          }
        }

        setMessages((m) => [...m, { role: "assistant", content: resultText }]);
      } catch {
        setError("Couldn't reach Agent 63. Is Ollama running (ollama serve)?");
      } finally {
        setLoading(false);
      }
    },
    [loading, students, status, driver, actions]
  );

  return { messages, loading, error, send };
}
