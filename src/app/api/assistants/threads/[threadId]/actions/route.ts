import { NextRequest } from "next/server";
import { openai } from "../../../../../../lib/openaiClient";

// // Send a new message to a thread
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { threadId: string } }
// ) {
//   const { toolCallOutputs, runId } = await request.json();

//   const stream = openai.beta.threads.runs.submitToolOutputsStream(
//     params.threadId, 
//     runId, 
//     { tool_outputs: toolCallOutputs }
//   );

//   // You can return a standard Response or NextResponse:
//   return new Response(stream.toReadableStream());
// }


// import { NextRequest } from "next/server";
// import { openai } from "../../../../../../lib/openaiClient";

// Send a new message to a thread
export async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } } // ✅ Correctly typed params
) {
  try {
    // ✅ Ensure the request has a valid JSON body
    const { toolCallOutputs, runId } = await req.json();

    if (!toolCallOutputs || !runId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // ✅ Submit tool outputs to OpenAI
    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      params.threadId, // ✅ Use params.threadId properly
      runId,
      { tool_outputs: toolCallOutputs }
    );

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
