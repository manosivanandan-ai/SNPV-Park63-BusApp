const GEMINI_ENDPOINT = "/.netlify/functions/gemini-chat";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function askGemma(systemContext: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemContext, history }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.content as string;
}
