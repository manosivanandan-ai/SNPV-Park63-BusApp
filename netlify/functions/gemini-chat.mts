const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server missing GEMINI_API_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const { systemContext, history } = (await req.json()) as {
    systemContext: string;
    history: ChatMessage[];
  };

  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemContext }] },
      contents,
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return new Response(JSON.stringify({ error: `Gemini request failed: ${res.status} ${errText}` }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const data = await res.json();
  const text: string =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";

  return new Response(JSON.stringify({ content: text }), {
    headers: { "content-type": "application/json" },
  });
};
