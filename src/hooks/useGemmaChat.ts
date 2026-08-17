import { useCallback, useState } from "react";
import { askGemma, type ChatMessage } from "@/lib/gemma";
import { PHASE_LABEL } from "@/data/initialData";
import type { Driver, BusStatusValue, Student } from "@/types";

function buildContext(students: Student[], status: BusStatusValue, driver: Driver): string {
  const roster = students.map(
    (s) => `${s.name} (${PHASE_LABEL[s.phase]}, ${s.boarded ? "boarded" : "not boarded"})`
  );

  return [
    "You are Agent 63, an assistant inside a school bus attendance app, answering staff questions.",
    "Answer only using the roster and status data below. Be concise (1-3 sentences). If asked for a list, use names only.",
    `Bus status: ${status}.`,
    `Driver: ${driver.name} (${driver.phone}).`,
    "Roster:",
    ...roster,
  ].join("\n");
}

export function useGemmaChat(students: Student[], status: BusStatusValue, driver: Driver) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setLoading(true);
      setError(null);

      try {
        const context = buildContext(students, status, driver);
        const reply = await askGemma(context, next);
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } catch {
        setError("Couldn't reach Agent 63. Is Ollama running (ollama serve)?");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, students, status, driver]
  );

  return { messages, loading, error, send };
}
