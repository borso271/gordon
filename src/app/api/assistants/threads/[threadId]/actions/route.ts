import { NextRequest } from "next/server";
import { openai } from "../../../../../../lib/openaiClient";

// Send a new message to a thread
export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const { toolCallOutputs, runId } = await request.json();

  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    params.threadId, 
    runId, 
    { tool_outputs: toolCallOutputs }
  );

  // You can return a standard Response or NextResponse:
  return new Response(stream.toReadableStream());
}
