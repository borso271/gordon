import { NextRequest, NextResponse } from "next/server";
import { assistantId } from "../../../../../../lib/assistantConfig";
import { openai } from "../../../../../../lib/openaiClient";


async function waitForRunCompletion(threadId: string, timeout = 15000): Promise<void> {
  const start = Date.now();
  const pollInterval = 1000;

  // Get the most recent run
  const runs = await openai.beta.threads.runs.list(threadId, { limit: 1 });
  const activeRun = runs.data.find(run =>
    ["queued", "in_progress", "cancelling", "requires_action"].includes(run.status)
  );

  if (!activeRun) return;

  while (Date.now() - start < timeout) {
    const run = await openai.beta.threads.runs.retrieve(threadId, activeRun.id);
    if (["completed", "failed", "cancelled", "expired"].includes(run.status)) {
      return;
    }
    await new Promise(res => setTimeout(res, pollInterval));
  }

  throw new Error("Timeout: Previous run did not complete in time.");
}

export async function POST(req: NextRequest, context: any): Promise<Response> {
  const params: { threadId: string } = await context.params;

  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    // Wait if a previous run is still active
    await waitForRunCompletion(params.threadId);

    // Add user message
    await openai.beta.threads.messages.create(params.threadId, {
      role: "user",
      content: content,
    });

    // Start a new run
    const stream = openai.beta.threads.runs.stream(params.threadId, {
      assistant_id: assistantId,
    });

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



// export async function POST(req: NextRequest, context: any): Promise<Response> {
//   // Await context.params before using its properties
//   const params: { threadId: string } = await context.params;

//   try {
//     const { content } = await req.json();
//     if (!content) {
//       return NextResponse.json({ error: "Missing content" }, { status: 400 });
//     }

//     await openai.beta.threads.messages.create(params.threadId, {
//       role: "user",
//       content: content,
//     });

//     const stream = openai.beta.threads.runs.stream(params.threadId, {
//       assistant_id: assistantId,
//     });

//     return new Response(stream.toReadableStream(), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error processing POST request:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
