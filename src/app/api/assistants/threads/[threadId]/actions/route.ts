import { openai } from "../../../../../../lib/openaiClient";

// Send a new message to a thread
export async function POST(
  request: Request, 
  context: { params: { threadId: string } } // ✅ Correctly typed context parameter
) {
  const { toolCallOutputs, runId } = await request.json();

  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    context.params.threadId, // ✅ Use context.params.threadId
    runId,
    { tool_outputs: toolCallOutputs }
  );

  return new Response(stream.toReadableStream());
}
