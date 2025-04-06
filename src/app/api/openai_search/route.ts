import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing 'query'" }, { status: 400 });
    }


console.log("openai client is: ", client)

const response = await client.responses.create({
    model: "gpt-4o-mini",
    tools: [ { type: "web_search_preview" } ],
    input: "What are upcoming ipos in the saudi market?",
});

    const messageBlock = response.output.find((block: any) => block.type === 'message');
    const contentItem = messageBlock?.content?.find((c: any) => c.type === 'output_text');
    const messageText = contentItem?.text ?? "No result.";
    
    // To get citations (annotations):
    const annotations = contentItem?.annotations ?? [];
    
    // To get tool calls (like web search events):
    const toolCalls = response.output.filter((block: any) => block.type === 'web_search_call');
    
    console.log("stuff is: ", messageText, annotations, toolCalls)
    return NextResponse.json({
        result: messageText,
        citations: annotations,
        toolCalls: toolCalls
      });
      
  } catch (error: any) {
    console.error("OpenAI Web Search Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
