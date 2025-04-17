
// api/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { HumanMessage, ToolMessage } from "@langchain/core/messages";
// import { isAIMessageChunk } from "@langchain/core/messages"; // Ensure this utility is correctly imported or defined
// import { langapp } from "../../langgraph2/agent";
// import { AppState } from "../../langgraph2/state";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic"; // no caching

// export async function GET(req: NextRequest) {
//   try {
//     console.log("📡 Incoming GET request for SSE streaming");


//     // In api/route.ts
// const initialState: AppState = {
//     messages: [
//       new HumanMessage(
//       "What's the weather in tokyo?"
//       )
//     ],
//     index: 0,
//   };

//     const stream = await langapp.stream(
//       initialState, // Pass the initial state with index: 0
//       { streamMode: "messages" } // Stream individual messages
//     );

//     const encoder = new TextEncoder();
//     const streamOutput = new ReadableStream({
//       async start(controller) {
//         console.log("🚀 Starting SSE stream...");
//         // stream yields key-value pairs: [nodeName, partialStateUpdate]
//         // when streamMode='messages', it yields [BaseMessage] chunks
//         for await (const [message, metadata] of stream)  {
//           // The message object itself should have _getType and content
//           if (!message || typeof message._getType !== 'function') {
//              console.warn("⚠️ Received unexpected chunk:", message);
//              continue; // Skip malformed chunks
//           }

//           let debug = `${message._getType()}: ${message.content}`;
//           if (isAIMessageChunk(message)) {
//             debug = `AI-CHUNK: ${message.content}`; // Content might be partial token
//           } else if (message._getType() === 'tool') {
//             debug = `TOOL: ${message.content}`;
//           } else if (message._getType() === 'human') {
//              debug = `HUMAN: ${message.content}`;
//           }

//           // console.log("🔹 Streamed chunk =>", debug);
//           // Log both the summary string AND the full object structure
// console.log("🔹 Streamed chunk Summary =>", debug);
// console.log("🔹 Streamed chunk Full Object =>", JSON.stringify(message, null, 2)); // Stringify for detailed view

//           const payload = {
//             type: message._getType(),
//             content: message.content,
//             // Add tool_call_id if it's a tool message for potential UI linking
//             ...(message._getType() === 'tool' && (message as ToolMessage).tool_call_id && { tool_call_id: (message as ToolMessage).tool_call_id }),
//           };

//           controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
//         }
//         console.log("🏁 SSE stream finished.");
//         controller.close();
//       },
//       cancel(reason) {
//           console.log("❌ SSE stream cancelled:", reason);
//       }
//     });

//     return new Response(streamOutput, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-store, no-transform",
//         Connection: "keep-alive",
//         "X-Accel-Buffering": "no", // Often needed for SSE with proxies like Nginx
//       },
//     });
//   } catch (err: any) {
//     console.error("❌ SSE route error:", err);
//     return new Response(JSON.stringify({ error: err?.message ?? "Internal Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// api/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, ToolMessage, BaseMessage, AIMessage } from "@langchain/core/messages"; // Added BaseMessage, AIMessage
import { isAIMessageChunk, AIMessageChunk } from "@langchain/core/messages"; // Added AIMessageChunk

import { langapp } from "../../langgraph2/agent"; // Adjust path if needed
import { AppState } from "../../langgraph2/state"; // Adjust path if needed

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // no caching

export async function GET(req: NextRequest) {
  try {
    console.log("📡 Incoming GET request for SSE streaming");

    // In api/route.ts
    const initialState: AppState = {
        messages: [
        new HumanMessage(
            "What's the weather in tokyo?" // User asks weather
        )
        ],
        index: 0,
    };

    const stream = await langapp.stream(
      initialState,
      { streamMode: "messages" }
    );

    const encoder = new TextEncoder();
    const streamOutput = new ReadableStream({
      async start(controller) {
        console.log("🚀 Starting SSE stream...");
        // Use a more specific type hint for the loop variable if possible
        for await (const [message, metadata] of stream as AsyncIterable<[BaseMessage | AIMessageChunk, any]>) { // Destructure the 
       // for await (const message of stream as AsyncIterable<BaseMessage | AIMessageChunk>) {
          if (!message || typeof message._getType !== 'function') {
             console.warn("⚠️ Received unexpected chunk:", message);
             continue;
          }

          const messageType = message._getType();
          const rawContent = message.content; // Get the raw content
          let textContentChunk = ""; // To store the extracted text
          let debugString = "";
          const payload: Record<string, any> = { type: messageType };

          // --- Content Extraction and Debug String ---
          if (isAIMessageChunk(message)) {
              debugString = `AI-CHUNK: `;

              // ** NEW: Check if content is the array structure **
              if (Array.isArray(rawContent) && rawContent.length > 0 && rawContent[0].type === 'text' && typeof rawContent[0].text === 'string') {
                  textContentChunk = rawContent[0].text; // Extract the text
                  debugString += `Content(Text)=${textContentChunk}`; // Log extracted text
              }
              // Handle simple string content (fallback)
              else if (typeof rawContent === 'string') {
                  textContentChunk = rawContent;
                  debugString += `Content(String)="${textContentChunk}"`;
              }
               // Handle other potential complex content structures if needed
              else if (rawContent && typeof rawContent !== 'string') {
                 debugString += `Content(Other)=${JSON.stringify(rawContent)}`;
                 // Decide if you need to send this complex structure rawContent in payload
                 // payload.complex_content = rawContent;
              }


              // Handle tool call chunks
              if (message.tool_call_chunks && message.tool_call_chunks.length > 0) {
                  debugString += (textContentChunk ? " | " : "") + `ToolChunks=${JSON.stringify(message.tool_call_chunks)}`;
                  payload.tool_call_chunks = message.tool_call_chunks;
              }

              if (!textContentChunk && (!message.tool_call_chunks || message.tool_call_chunks.length === 0)) {
                 debugString += " [Empty Chunk/Structure Update]";
              }

          } else {
              // Handle non-chunk messages (e.g., ToolMessage, full AIMessage)
              // Apply similar logic if full messages can also have complex content
              if (Array.isArray(rawContent) && rawContent.length > 0 && rawContent[0].type === 'text' && typeof rawContent[0].text === 'string') {
                    textContentChunk = rawContent[0].text;
                    debugString = `${messageType}: [Text Content Length=${textContentChunk.length}]`;
              } else {
                   textContentChunk = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent); // Default handling
                   debugString = `${messageType}: ${textContentChunk}`;
              }

              // Add tool_call_id for ToolMessage
              if (messageType === 'tool' && (message as ToolMessage).tool_call_id) {
                  payload.tool_call_id = (message as ToolMessage).tool_call_id;
                  debugString += ` | ToolCallID=${payload.tool_call_id}`;
              }
               // Add full tool_calls for final AIMessage
               if (messageType === 'ai' && (message as AIMessage).tool_calls?.length) {
                  payload.tool_calls = (message as AIMessage).tool_calls;
                  debugString += ` | ToolCalls=${JSON.stringify(payload.tool_calls)}`;
               }
          }

          // --- Prepare Payload ---
          // Always include the extracted text content if available
          if (textContentChunk) {
              payload.content = textContentChunk;
          }

          console.log("🔹 Streamed chunk Summary =>", debugString);
        //   console.log("🔹 Streamed chunk Full Object =>", JSON.stringify(message, null, 2)); // Keep for deep debugging if needed

          // --- Send SSE ---
          // Send only if there's text content or tool information
          if (payload.content || payload.tool_call_chunks || payload.tool_calls || payload.tool_call_id) {
             controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          } else {
              console.log("🔹 Skipping empty/structural chunk from SSE.");
          }

        }
        console.log("🏁 SSE stream finished.");
        controller.close();
      },
      cancel(reason) {
          console.log("❌ SSE stream cancelled:", reason);
      }
    });

    // Return SSE
    return new Response(streamOutput, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: any) {
    console.error("❌ SSE route error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage, cause: (err as any).cause }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}