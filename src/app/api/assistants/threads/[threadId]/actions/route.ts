
import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../../../../lib/openaiClient";

export async function POST(req: NextRequest, context: any) {
  // Cast context to a known shape
  const { params } = context as { params: { threadId: string } };

  try {
    const { toolCallOutputs, runId } = await req.json();
    if (!toolCallOutputs || !runId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      params.threadId,
      runId,
      { tool_outputs: toolCallOutputs }
    );

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



// import { NextRequest, NextResponse } from "next/server";
// import { openai } from "../../../../../../lib/openaiClient";

// export async function POST(req: NextRequest, context: any) {
//   // Cast context to a known shape
//   const { params } = context as { params: { threadId: string } };

//   try {
//     const { toolCallOutputs, runId } = await req.json();
//     if (!toolCallOutputs || !runId) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const stream = openai.beta.threads.runs.submitToolOutputsStream(
//       params.threadId,
//       runId,
//       { tool_outputs: toolCallOutputs }
//     );

//     return new Response(stream.toReadableStream(), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error processing POST request:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
