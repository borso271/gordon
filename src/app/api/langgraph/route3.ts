

import { langapp } from "../../langgraph/agent";
import { HumanMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";


// Helper function (if not importing)
function isAIMessageChunk(msg: any): msg is import("@langchain/core/messages").AIMessageChunk {
    return msg?._getType?.() === 'ai' && typeof msg.content === 'string' // Add more checks if needed
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // no caching

export async function GET(req: NextRequest) {
  try {
    console.log("📡 Incoming GET request for SSE streaming");

    // This is the step that *really matters*:
    const stream = await langapp.stream(
      {
        messages: [
          new HumanMessage("Show me financial data in batches and explain each one. Then ask for more.")
        ],
      },
      { streamMode: "messages" }
    );

    const encoder = new TextEncoder();
    const streamOutput = new ReadableStream({
      async start(controller) {
        // for-await to get each chunk/step
        for await (const [message] of stream) {
          let debug = `${message._getType()}: ${message.content}`;

          // If it's a partial chunk from the AI...
          if (isAIMessageChunk(message)) {
            // You might see partial tokens building up
            debug = `AI-CHUNK: ${message.content}`;
          }

          console.log("🔹 Streamed chunk =>", debug);

          const payload = {
            type: message._getType(),
            content: message.content,
          };

          // SSE chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        }
        controller.close();
      },
    });

    // Return SSE
    return new Response(streamOutput, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("❌ SSE route error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

