const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "gemma3:4b";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function askGemma(systemContext: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemContext }, ...history],
      format: "json",
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemma request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.message.content as string;
}
