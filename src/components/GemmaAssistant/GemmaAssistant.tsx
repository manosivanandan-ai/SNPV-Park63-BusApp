import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGemmaChat } from "@/hooks/useGemmaChat";
import type { Driver, BusStatusValue, Phase, Student } from "@/types";

interface GemmaAssistantProps {
  students: Student[];
  status: BusStatusValue;
  driver: Driver;
  defaultPhase: Phase;
  onToggleBoarded: (id: string) => void;
  onAddStudent: (name: string, phase: Phase) => void;
  onRemoveStudent: (id: string) => void;
  onSetStatus: (value: BusStatusValue) => void;
}

export function GemmaAssistant({
  students,
  status,
  driver,
  defaultPhase,
  onToggleBoarded,
  onAddStudent,
  onRemoveStudent,
  onSetStatus,
}: GemmaAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, error, send } = useGemmaChat(students, status, driver, {
    onToggleBoarded,
    onAddStudent,
    onRemoveStudent,
    onSetStatus,
    defaultPhase,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex h-[28rem] w-[20rem] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-glow sm:w-[22rem]"
          >
            <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-lavender-500" />
                <p className="font-heading text-sm font-bold text-slate-700">Agent 63</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-lavender-50 hover:text-slate-600"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {messages.length === 0 && !loading && (
                <p className="text-xs text-slate-400">
                  Try "mark Aadhya as boarded", "add Priya to phase 1", "remove Bob", "set bus status to left", or ask a question about the roster.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl bg-lavender-500 px-3 py-2 text-sm text-white"
                      : "mr-auto max-w-[85%] rounded-2xl bg-lavender-50 px-3 py-2 text-sm text-slate-700"
                  }
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="mr-auto max-w-[85%] rounded-2xl bg-lavender-50 px-3 py-2 text-sm text-slate-400">
                  Thinking…
                </div>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-lavender-100 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the roster…"
                className="h-10 flex-1 rounded-xl border-2 border-lavender-100 bg-white px-3 text-sm outline-none focus:border-lavender-300"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
      >
        <Button
          size="fab"
          variant="sky"
          onClick={() => setOpen((o) => !o)}
          aria-label="Ask Agent 63"
          className="shadow-glow"
        >
          <Bot className="h-7 w-7" strokeWidth={2.5} />
        </Button>
      </motion.div>
    </div>
  );
}
