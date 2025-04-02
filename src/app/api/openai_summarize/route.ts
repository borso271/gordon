import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("api key is: ", apiKey)

export async function POST(req: NextRequest) {
  try {
    const { query, content } = await req.json();

    if (!query || !content) {
      return NextResponse.json({ error: "Missing 'query' or 'content'" }, { status: 400 });
    }

    const fullPrompt = `
You are an expert information extractor.

User query:
${query}

Content:
${content}

Extract only the most relevant and concise information to answer the user query.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
          {
              role: "user",
              content: fullPrompt,
          },
      ],
  });
    // Grab the output text
    const outputText = completion.choices[0].message.content ?? "No output returned.";

    return NextResponse.json({ result: outputText });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}



