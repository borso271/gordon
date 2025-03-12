import { assistantId } from "../../../../../../lib/assistantConfig";
import { openai } from "../../../../../../lib/openaiClient";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, context) {

  const params = await context.params; // ✅ Await context.params
  const threadId = params.threadId; // ✅ Extract threadId after awaiting

  const { content } = await request.json();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
