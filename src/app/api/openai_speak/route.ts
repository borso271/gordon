// app/api/speak/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text, voice = "nova", instructions = "" } = await req.json();

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice,
    input: text,
    instructions,
    response_format: "wav", // best for streaming
  });

  // Return the stream directly
  return new Response(response.body as ReadableStream, {
    headers: {
      "Content-Type": "audio/wav",
      "Transfer-Encoding": "chunked",
    },
  });
}
