import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    // Check if OpenAI is configured
    const openaiKey = process.env.OPENAI_API_KEY

    if (openaiKey && openaiKey !== "your_openai_api_key") {
      const { OpenAI } = await import("openai")
      const openai = new OpenAI({ apiKey: openaiKey })

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Eres un asistente de búsqueda para una plataforma de podcasts.
Busca en los episodios el tema que el usuario pregunta y responde:
- Título del episodio donde aparece
- Timestamp aproximado
- Un breve resumen de lo que se dijo

Responde en español, sé conciso y útil.`,
          },
          { role: "user", content: query },
        ],
        max_tokens: 500,
        temperature: 0.3,
      })

      const answer = completion.choices[0]?.message?.content || "No encontré información relevante."

      return NextResponse.json({
        success: true,
        data: { query, answer, source: "openai" },
      })
    }

    // Fallback mock response when OpenAI is not configured
    return NextResponse.json({
      success: true,
      data: {
        query,
        answer: `"${query}" aparece en varios episodios.\n\n` +
          `🎙 **Detrás del Espejo** — "El espejo roto" (12:34)\n` +
          `🎙 **Me gusta que te guste** — "Invitado sorpresa" (45:12)\n\n` +
          `_Conecta OpenAI en .env.local para búsqueda semántica real._`,
        source: "mock",
      },
    })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json(
      { success: false, error: "Error processing your request" },
      { status: 500 }
    )
  }
}
