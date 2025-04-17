// agent.ts

// agent.ts
import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { Runnable } from "@langchain/core/runnables";
import { ToolNode } from "@langchain/langgraph/prebuilt"; // Use ToolNode for the start tool
import { DynamicStructuredTool } from "@langchain/core/tools";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";

import { AppState, AppStateAnnotation } from "./state";
import { fetchDataBatch } from "./tools"; // Only need the fetch function

// --- Tool Definitions ---

// Tool 1: Called by the LLM to initiate the flow
const startAnalysisTool = new DynamicStructuredTool({
    name: "start_financial_analysis",
    description: "Call this tool to begin the process of analyzing financial data when requested by the user.",
    schema: z.object({
        // Optional: Could take arguments like stock symbol, etc.
        // query: z.string().describe("The subject of the analysis (e.g., stock symbol or company name)").optional(),
    }),
    func: async (/* { query } */) => {
        console.log("✅ start_financial_analysis tool executed.");
        // Return a simple confirmation or status message
        return "Analysis process initiated. Fetching first data batch.";
    },
});

// Tool 2: Used internally by the deterministic loop (name/schema needed)
const showDataToolDefinition = {
    name: "show_data",
    description: "Provides a batch of financial data.", // Internal description
    schema: z.object({}),
};

const webtool = {"type": "web_search_preview"}

// --- Models ---
// Model for the initial decision (needs startAnalysisTool)
const initialModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  streaming: true, // Keep streaming for potential initial thoughts
  temperature: 0,
  useResponsesApi: true,
}).bindTools([webtool, startAnalysisTool]);

// Model for analyzing data batches (doesn't strictly need tools bound)
const analysisModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  streaming: true,
  temperature: 0,
});

// --- Graph Nodes ---

// Node 0: Initial Agent - Processes user request, decides to call start_analysis
async function agent_start(state: AppState): Promise<Partial<AppState>> {
    console.log("🏁 Agent Start: Processing initial user request.");
    // Only send the human message (or relevant initial history)
    const initialMessages = state.messages.filter(m => m._getType() === 'human');
    if (!initialMessages.length) {
        throw new Error("Agent Start node requires an initial HumanMessage.");
    }
    try {
        const response = await initialModel.invoke(initialMessages);
        console.log("📥 Initial Agent response received.");
        return { messages: [response] };
    } catch (err) {
        console.error("❌ Initial Agent invocation failed:", err);
        throw err;
    }
}

// Node 1: Executes the start_analysis tool if called
// We can use the prebuilt ToolNode for simplicity
const startAnalysisToolNode = new ToolNode([startAnalysisTool]);

// Node 2: Triggers the first *deterministic* show_data call
// Runs *after* startAnalysisToolNode succeeds.
async function triggerFirstDataBatch(state: AppState): Promise<Partial<AppState>> {
    console.log("⚙️ Triggering first data batch fetch.");
    const toolCallId = `call_data_0_${uuidv4().slice(0, 8)}`; // ID for the *first* show_data call
    const syntheticAiMessage = new AIMessage({
        content: "",
        tool_calls: [{ name: showDataToolDefinition.name, args: {}, id: toolCallId }],
    });
    // Don't modify index here, executeInitialDataTool will handle index 0
    return { messages: [syntheticAiMessage] };
}

// Node 3: Executes the *first* show_data call (index 0)
async function executeInitialDataTool(state: AppState): Promise<Partial<AppState>> {
    console.log(`🛠️ Executing initial '${showDataToolDefinition.name}'. Index: ${state.index}`); // Expect index 0
    let toolMessage: ToolMessage | null = null;
    let nextIndex = state.index;

    const lastMessage = state.messages[state.messages.length - 1];
    // Check if the preceding message is the synthetic AI call from triggerFirstDataBatch
    if (lastMessage?._getType() === 'ai' && (lastMessage as AIMessage).tool_calls?.some(tc => tc.name === showDataToolDefinition.name)) {
         const dataToolCall = (lastMessage as AIMessage).tool_calls?.find(tc => tc.name === showDataToolDefinition.name);
         if (dataToolCall && dataToolCall.id) {
            const toolCallId = dataToolCall.id;
            console.log(`✅ Found synthetic '${showDataToolDefinition.name}' call ID: ${toolCallId}`);
            const toolOutput = fetchDataBatch(0); // Fetch index 0
            nextIndex = 1; // Set index for the next loop iteration
            toolMessage = new ToolMessage({ content: toolOutput, tool_call_id: toolCallId });
            console.log(`📊 Initial Data output: "${toolOutput}". New index: ${nextIndex}`);
         } else { console.error("❌ Failed to find synthetic data tool call ID!"); }
    } else { console.error("❌ Preceding message for initial data execution was not the expected synthetic AI call!", lastMessage); }

    return { index: nextIndex, messages: toolMessage ? [toolMessage] : [] };
}

// Node 4: Agent analyzes a data batch (REVISED FILTERING AGAIN)
async function agent_analyze_data(state: AppState): Promise<Partial<AppState>> {
    console.log("🧠 Agent Analyze Data: Calling analysis model.");

    const messagesToSend: BaseMessage[] = [];
    const allMessages = state.messages;

    for (let i = 0; i < allMessages.length; i++) {
        const msg = allMessages[i];
        const msgType = msg._getType();
        let filterOutReason: string | null = null; // Reason for filtering

        // --- Filtering Conditions ---

        // Condition 1: Is it the initial AI message calling start_analysis?
        if (msgType === 'ai' && (msg as AIMessage).tool_calls?.some(tc => tc.name === startAnalysisTool.name)) {
            filterOutReason = `Initial AI call to '${startAnalysisTool.name}'`;
        }
        // Condition 2: Is it the result message from the start_analysis tool?
        else if (msgType === 'tool' && msg.content === "Analysis process initiated. Fetching first data batch.") {
             filterOutReason = `'${startAnalysisTool.name}' tool result message`;
        }
        // Condition 3: Is it a synthetic show_data AI call that ISN'T needed by API rules?
        else if (msgType === 'ai' && (msg as AIMessage).content === "" && (msg as AIMessage).tool_calls?.some(tc => tc.name === showDataToolDefinition.name)) {
            const nextMsgIndex = i + 1;
            const syntheticCallId = (msg as AIMessage).tool_calls?.[0]?.id;
            // Check if the *next* message is the corresponding ToolMessage
            if (!(nextMsgIndex < allMessages.length &&
                  allMessages[nextMsgIndex]._getType() === 'tool' &&
                  (allMessages[nextMsgIndex] as ToolMessage).tool_call_id === syntheticCallId))
            {
                 filterOutReason = `Synthetic show_data AI (ID: ${syntheticCallId}) not followed by its ToolMessage`;
            }
            // ELSE: Keep the synthetic message (filterOutReason remains null)
        }

        // --- Keep or Discard ---
        if (filterOutReason) {
            console.log(`🗑️ Filtering Message ${i} (${msgType}): ${filterOutReason}`);
        } else {
            console.log(`✅ Keeping Message ${i} (${msgType})`);
            messagesToSend.push(msg);
        }
    }

    // ... (rest of the node: empty check, final sequence check, invoke model - NO CHANGES NEEDED HERE) ...

    if (messagesToSend.length === 0) {
        console.warn("⚠️ No messages left for analysis LLM after filtering.");
         return { messages: [] };
    }
    // ... Final checks ...
     const finalMessageToSend = messagesToSend[messagesToSend.length - 1];
    if (finalMessageToSend._getType() === 'tool') {
        const penultimateMessage = messagesToSend.length > 1 ? messagesToSend[messagesToSend.length - 2] : null;
        const requiredToolCallId = (finalMessageToSend as ToolMessage).tool_call_id;
        if (!(penultimateMessage?._getType() === 'ai' && (penultimateMessage as AIMessage).tool_calls?.some(tc => tc.id === requiredToolCallId && tc.name === showDataToolDefinition.name))) {
             console.error("❌ Analysis history ends with ToolMessage but preceding message isn't the correct synthetic AI call!", messagesToSend.map(m => m._getType()));
             messagesToSend.pop();
             if (messagesToSend.length === 0) return { messages: [] };
        }
    } else if (finalMessageToSend._getType() === 'human' && messagesToSend.length > 1) {
        console.error("❌ Filtering left only Human message before analysis call. Likely filter error.", messagesToSend);
        return { messages: [] };
    }


    console.log("✉️ Messages being sent to Analysis LLM:", messagesToSend.map(m => ({ type: m._getType(), content: m.content, tool_calls: (m as AIMessage).tool_calls })));
    try {
        const response = await analysisModel.invoke(messagesToSend);
        console.log("📥 Analysis LLM response received.");
        return { messages: [response] };
    } catch (err) {
        console.error("❌ Analysis Model invocation failed:", err);
        console.error("Original State messages at time of failure:", JSON.stringify(state.messages.map(m => m.toJSON()), null, 2));
        console.error("Filtered Messages sent to LLM:", JSON.stringify(messagesToSend.map(m=>m.toJSON()), null, 2));
        throw err;
    }
}



// Node 5: Combined node for preparing/executing show_data calls *within the loop* (index > 0)
async function prepareAndExecuteLoopDataTool(state: AppState): Promise<Partial<AppState>> {
    console.log(`🛠️ Entering *loop* '${showDataToolDefinition.name}' execution. Index: ${state.index}`); // Index >= 1

    const toolOutput = fetchDataBatch(state.index);
    const nextIndex = state.index + 1;
    console.log(`📊 Fetched loop data output: "${toolOutput}". New index: ${nextIndex}`);

    const toolCallId = `call_data_loop_${uuidv4().slice(0, 8)}`;
    const toolMessage = new ToolMessage({ content: toolOutput, tool_call_id: toolCallId });
    const syntheticAiMessage = new AIMessage({
        content: "",
        tool_calls: [{ name: showDataToolDefinition.name, args: {}, id: toolCallId }],
    });

    console.log(`➕ Returning loop Synthetic AI (ID: ${toolCallId}) and Tool message.`);
    return { index: nextIndex, messages: [syntheticAiMessage, toolMessage] };
}


// --- Edge Routing ---

// Route 1: After Initial Agent -> Did it call start_analysis?
function routeAfterInitialAgent(state: AppState): "executeStartAnalysis" | "__end__" {
    console.log("🚦 Routing after initial agent...");
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?._getType() === "ai" && (lastMessage as AIMessage).tool_calls?.some(tc => tc.name === startAnalysisTool.name)) {
        console.log(`✅ Initial agent called '${startAnalysisTool.name}'. Proceeding.`);
        return "executeStartAnalysis";
    } else {
        console.log(`🚫 Initial agent did not call '${startAnalysisTool.name}'. Ending flow.`);
        // Could potentially route back to agent with a message asking user to clarify?
        return "__end__";
    }
}

// Route 2: After Any data Tool Execution (Initial or Loop) -> Analyze or End?
function routeAfterDataTool(state: AppState): "agent_analyze" | "__end__" {
    const lastMessage = state.messages[state.messages.length - 1]; // Should be show_data ToolMessage

    console.log("🚦 Routing after data tool execution...");
    if (lastMessage?._getType() === "tool") {
         // Check if it's the result of show_data (heuristic: not the start confirmation msg)
         if (lastMessage.content !== "Analysis process initiated. Fetching first data batch.") {
            if (lastMessage.content === "No more data.") {
                console.log("⛔ Data tool reported 'No more data'. Ending flow.");
                return "__end__";
            } else {
                console.log("🔁 Data tool provided data. Routing to analysis agent.");
                return "agent_analyze";
            }
         } else {
             // This case shouldn't be hit if routing is correct, as startAnalysis result leads elsewhere
              console.warn("⚠️ Unexpectedly routing after start_analysis tool result here. Check graph logic.");
              return "__end__";
         }
    }
    console.error("❌ Expected ToolMessage after data tool execution, but found:", lastMessage?._getType(), ". Ending flow.");
    return "__end__";
}

// Route 3: After Agent Analysis -> Loop or End?
function routeAfterAnalysis(state: AppState): "prepareAndExecuteLoopDataTool" | "__end__" {
    console.log("🚦 Routing after analysis agent...");
    const messages = state.messages;
    let lastRelevantMessageForAgent: BaseMessage | null = null;
    // Find the last message the agent analyzed (skipping synthetics)
    for (let i = messages.length - 2; i >= 0; i--) {
       const msg = messages[i];
       if(msg._getType() === 'ai' && (msg as AIMessage).content === "" && (msg as AIMessage).tool_calls?.length) { continue; }
       // Skip the start_analysis result message too
       if(msg._getType() === 'tool' && msg.content === "Analysis process initiated. Fetching first data batch.") { continue; }
       lastRelevantMessageForAgent = msg;
       break;
    }

    // If the agent just processed "No more data"
    if (lastRelevantMessageForAgent?._getType() === "tool" && lastRelevantMessageForAgent.content === "No more data.") {
        console.log("🏁 Analysis agent processed 'No more data'. Ending flow.");
        return "__end__";
    }

    // Otherwise, continue the loop
    console.log("✅ Analysis agent finished. Proceeding to next loop data execution.");
    return "prepareAndExecuteLoopDataTool"; // Go to the combined node for the loop
}


// --- Graph Construction ---
const workflow = new StateGraph<AppState>({ channels: AppStateAnnotation })
  // Add all nodes
  .addNode("agent_start", agent_start)                         // Processes initial request
  .addNode("executeStartAnalysis", startAnalysisToolNode)      // Runs the start tool
  .addNode("triggerFirstBatch", triggerFirstDataBatch)       // Creates first synthetic show_data call
  .addNode("executeInitialData", executeInitialDataTool)       // Runs first show_data
  .addNode("agent_analyze", agent_analyze_data)                // Analyzes data
  .addNode("executeLoopData", prepareAndExecuteLoopDataTool) // Runs subsequent show_data (loop)

  // Define the graph flow
  .addEdge(START, "agent_start") // Entry point

  // After initial agent, check if it called the start tool
  .addConditionalEdges(
      "agent_start",
      routeAfterInitialAgent,
      { executeStartAnalysis: "executeStartAnalysis", __end__: END }
  )

  // After start tool executes, always trigger the first data batch
  .addEdge("executeStartAnalysis", "triggerFirstBatch")

  // After triggering, always execute the first data batch
  .addEdge("triggerFirstBatch", "executeInitialData")

   // After the initial data tool runs, check output
  .addConditionalEdges(
      "executeInitialData",
      routeAfterDataTool,
      { agent_analyze: "agent_analyze", __end__: END }
  )

  // After analysis agent runs, check if loop continues
  .addConditionalEdges(
      "agent_analyze",
      routeAfterAnalysis,
      { prepareAndExecuteLoopDataTool: "executeLoopData", __end__: END }
  )

  // After subsequent loop data tool runs, check output
   .addConditionalEdges(
      "executeLoopData",
      routeAfterDataTool, // Reuse the same router as after initial data
      { agent_analyze: "agent_analyze", __end__: END }
  );

// Compiled Graph
export const langapp = workflow.compile();

// import { StateGraph, END, START } from "@langchain/langgraph"; // Import END/START
// import { ChatOpenAI } from "@langchain/openai";
// import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
// import { Runnable } from "@langchain/core/runnables";
// import { DynamicStructuredTool } from "@langchain/core/tools";
// import { v4 as uuidv4 } from 'uuid';
// import { z } from "zod";

// import { AppState, AppStateAnnotation } from "./state";
// import { fetchDataBatch } from "./tools";

// // --- Tool Definition ---
// const showDataToolDefinition = {
//     name: "show_data",
//     description: "Provides the next batch of financial data.",
//     schema: z.object({}),
// };
// const toolsForBinding: Runnable[] = [
//     new DynamicStructuredTool({ ...showDataToolDefinition, func: async () => "" })
// ];

// // --- Model ---
// const model = new ChatOpenAI({
//   model: "gpt-4o-mini",
//   streaming: true,
//   temperature: 0,
// });
// // .bindTools(toolsForBinding); // Optional

// // --- Graph Nodes ---

// // Node 1: Call LLM for analysis
// // Node 1: Call LLM for analysis (Corrected Filtering)
// async function callModel(state: AppState): Promise<Partial<AppState>> {
//     console.log("🧠 Calling model for analysis.");

//     const messagesToSend: BaseMessage[] = [];
//     const allMessages = state.messages;

//     for (let i = 0; i < allMessages.length; i++) {
//         const msg = allMessages[i];
//         const isSynthetic = msg._getType() === 'ai' &&
//                             (msg as AIMessage).content === "" &&
//                             (msg as AIMessage).tool_calls?.some(tc => tc.name === showDataToolDefinition.name);

//         if (isSynthetic) {
//             // Check if the *next* message in the original state is the corresponding ToolMessage
//             const nextMsgIndex = i + 1;
//             const syntheticCallId = (msg as AIMessage).tool_calls?.[0]?.id;
//             if (nextMsgIndex < allMessages.length &&
//                 allMessages[nextMsgIndex]._getType() === 'tool' &&
//                 (allMessages[nextMsgIndex] as ToolMessage).tool_call_id === syntheticCallId)
//             {
//                 // KEEP this synthetic message because the API needs it before the tool message
//                 console.log(`✅ Keeping synthetic AI message (ID: ${syntheticCallId}) as required by API.`);
//                 messagesToSend.push(msg);
//             } else {
//                 // Filter out this synthetic message as it's not needed or is orphaned
//                  console.log(`🗑️ Filtering out synthetic AI message (ID: ${syntheticCallId}) as it's not immediately followed by its ToolMessage in history.`);
//             }
//         } else {
//             // Keep non-synthetic messages
//             messagesToSend.push(msg);
//         }
//     }

//     // ... (rest of callModel including empty checks and API call) ...

//     if (messagesToSend.length === 0) {
//         console.warn("⚠️ No messages left for LLM after filtering.");
//          return { messages: [] };
//     }

//      // Final check before sending
//     const finalMessageToSend = messagesToSend[messagesToSend.length - 1];
//     if (finalMessageToSend._getType() === 'tool') {
//         const penultimateMessage = messagesToSend.length > 1 ? messagesToSend[messagesToSend.length - 2] : null;
//         const requiredToolCallId = (finalMessageToSend as ToolMessage).tool_call_id;
//         if (!(penultimateMessage?._getType() === 'ai' && (penultimateMessage as AIMessage).tool_calls?.some(tc => tc.id === requiredToolCallId))) {
//              console.error("❌ History ends with ToolMessage but preceding message isn't the correct AI call!", messagesToSend.map(m => m._getType()));
//              messagesToSend.pop(); // Attempt recovery
//              if (messagesToSend.length === 0) return { messages: [] };
//         }
//     }

//     console.log("✉️ Messages being sent to LLM:", messagesToSend.map(m => ({ type: m._getType(), content: m.content, tool_calls: (m as AIMessage).tool_calls, tool_call_id: (m as ToolMessage).tool_call_id })));
//     try {
//         const response = await model.invoke(messagesToSend);
//         console.log("📥 LLM analysis response received.");
//         return { messages: [response] };
//     } catch (err) {
//         console.error("❌ Model invocation failed:", err);
//         console.error("State messages at time of failure:", JSON.stringify(state.messages.map(m => m.toJSON()), null, 2));
//         console.error("Messages sent to LLM:", JSON.stringify(messagesToSend.map(m=>m.toJSON()), null, 2));
//         throw err;
//     }
// }
// // async function callModel(state: AppState): Promise<Partial<AppState>> {
// //     console.log("🧠 Calling model for analysis.");

// //     // Simple Filtering: Remove any synthetic messages before sending to LLM.
// //     // The combined node ensures the ToolMessage is added *after* its synthetic precursor,
// //     // so we don't need complex lookahead filtering here anymore.
// //     const messagesForLLM = state.messages.filter(msg => {
// //         const isSynthetic = msg._getType() === 'ai' &&
// //                             (msg as AIMessage).content === "" &&
// //                             (msg as AIMessage).tool_calls?.some(tc => tc.name === showDataToolDefinition.name);
// //         if (isSynthetic) {
// //              console.log(`🗑️ Filtering out synthetic AI message before sending to LLM.`);
// //         }
// //         return !isSynthetic;
// //     });

// //     if (messagesForLLM.length === 0) {
// //         console.warn("⚠️ No messages left for LLM after filtering. This might happen if the graph starts unexpectedly.");
// //          return { messages: [] }; // Return empty to potentially end gracefully
// //     }

// //      // Basic check: Last message sent shouldn't be a tool message
// //     if (messagesForLLM[messagesForLLM.length - 1]._getType() === 'tool') {
// //         console.error("❌ Attempting to send history ending in ToolMessage to LLM after filtering!", messagesForLLM);
// //         // Handle error - maybe remove last message or throw
// //         messagesForLLM.pop();
// //         if(messagesForLLM.length === 0) return {messages: []}
// //         // throw new Error("Invalid message sequence ending in ToolMessage after filtering.");
// //     }


// //     console.log("✉️ Messages being sent to LLM:", messagesForLLM.map(m => ({ type: m._getType(), content: m.content })));
// //     try {
// //         const response = await model.invoke(messagesForLLM);
// //         console.log("📥 LLM analysis response received.");
// //         return { messages: [response] };
// //     } catch (err) {
// //         console.error("❌ Model invocation failed:", err);
// //         console.error("State messages at time of failure:", JSON.stringify(state.messages, null, 2));
// //         console.error("Messages sent to LLM:", JSON.stringify(messagesForLLM, null, 2));
// //         throw err;
// //     }
// // }

// // Node 2: Combined node to prepare synthetic AI, execute tool, return both
// async function prepareAndExecuteTool(state: AppState): Promise<Partial<AppState>> {
//     console.log(`🛠️ Entering combined tool execution node. Current index: ${state.index}`);

//     const toolOutput = fetchDataBatch(state.index);
//     const nextIndex = state.index + 1;
//     console.log(`📊 Fetched tool output: "${toolOutput}". New index: ${nextIndex}`);

//     // Generate ID for the call
//     const toolCallId = `call_syn_${uuidv4().slice(0, 8)}`;

//     // Create the ToolMessage *first* to ensure it exists
//     const toolMessage = new ToolMessage({
//         content: toolOutput,
//         tool_call_id: toolCallId, // Use the generated ID
//     });

//     // Create the synthetic AIMessage that *precedes* it
//     const syntheticAiMessage = new AIMessage({
//         content: "",
//         tool_calls: [{ name: showDataToolDefinition.name, args: {}, id: toolCallId }],
//     });

//     console.log(`➕ Returning Synthetic AI message (ID: ${toolCallId}) and Tool message.`);
//     // Return messages in the REQUIRED order: [Synthetic AI, Tool Result]
//     return {
//         index: nextIndex,
//         messages: [syntheticAiMessage, toolMessage], // Add pair atomically
//     };
// }


// // --- Edge Routing ---

// // Route 1: After Agent Analysis
// function routeAfterAgent(state: AppState): "executeTool" | "__end__" { // Route to the combined node
//     console.log("🚦 Routing after agent analysis...");
//     const messages = state.messages;
//     let lastRelevantMessageForAgent: BaseMessage | null = null;
//     for (let i = messages.length - 2; i >= 0; i--) {
//        const msg = messages[i];
//        if(msg._getType() === 'ai' && (msg as AIMessage).content === "" && (msg as AIMessage).tool_calls?.length) { continue; }
//        lastRelevantMessageForAgent = msg;
//        break;
//     }

//     if (lastRelevantMessageForAgent?._getType() === "tool" && lastRelevantMessageForAgent.content === "No more data.") {
//         console.log("🏁 Agent analyzed 'No more data'. Ending flow.");
//         return "__end__";
//     }

//     console.log("✅ Agent finished analysis or initial prompt. Proceeding to execute tool.");
//     return "executeTool"; // Go directly to the combined execution node
// }

// // Route 2: After Combined Tool Execution Node



// // Route 2: After Combined Tool Execution Node
// function routeAfterTool(state: AppState): "agent" | "__end__" {
//     // The state now contains the [..., SyntheticAI, ToolMessage] pair added by the last node
//     const lastMessage = state.messages[state.messages.length - 1]; // Should be ToolMessage

//     console.log("🚦 Routing after tool execution...");
//     if (lastMessage?._getType() === "tool") {
//         if (lastMessage.content === "No more data.") {
//             // *** FIXED LOGIC ***
//             console.log("⛔ Tool reported 'No more data'. Ending flow.");
//             return "__end__"; // Stop the graph immediately
//             // *** END FIX ***
//         } else {
//             console.log("🔁 Tool provided data. Routing back to agent for analysis.");
//             return "agent"; // Loop back to agent
//         }
//     }

//     console.error("❌ Expected ToolMessage after tool execution, but found:", lastMessage?._getType(), ". Ending flow.");
//     return "__end__";
// }



// // --- Graph Construction ---
// const workflow = new StateGraph<AppState>({ channels: AppStateAnnotation })
//   .addNode("agent", callModel)
//   .addNode("executeTool", prepareAndExecuteTool) // Combined node

//   .setEntryPoint("agent")

//   .addConditionalEdges(
//       "agent",
//       routeAfterAgent,
//       // If agent is done with "No more data" -> END
//       // Otherwise -> go execute the tool (which prepares the synthetic msg too)
//       { executeTool: "executeTool", __end__: END }
//   )
//   .addConditionalEdges(
//       "executeTool",
//       routeAfterTool,
//       // If tool returned "No more data" -> go to agent for final say
//       // Otherwise -> go back to agent with new data
//       { agent: "agent", __end__: END } // End only if state is corrupt
//   );

// // Compiled Graph
// export const langapp = workflow.compile();



// // agent.ts
// import { StateGraph } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatOpenAI } from "@langchain/openai";
// import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
// // import { type RunnableToolLike } from "@langchain/core/runnables";

// import { DynamicStructuredTool } from "@langchain/core/tools"; // Make sure this is imported if not already
// import { Runnable } from "@langchain/core/runnables"; // Import Runnable

// import { AppState, AppStateAnnotation } from "./state"; // Import updated state
// import { fetchDataBatch, showDataToolDefinition } from "./tools"; // Import fetch logic and tool definition


// // Use the tool definition for binding to the model
// // const tools: RunnableToolLike[] = [showDataToolDefinition];
// const tools: Runnable[] = [showDataToolDefinition];

// // Model with debugging
// const model = new ChatOpenAI({
//   model: "gpt-4o-mini",
//   streaming: true,
//   temperature: 0,
//   //useResponsesApi: true, // Might not be needed/available depending on version
// }).bindTools(tools);

// // Graph Node: Agent Step (remains largely the same)
// async function callModel(state: AppState): Promise<Partial<AppState>> {
//   console.log("🧠 Calling model with messages:", state.messages);
//   try {
//     const res = await model.invoke(state.messages);
//     console.log("📥 Model response:", res);
//     // The state automatically appends messages using the reducer
//     return { messages: [res] };
//   } catch (err) {
//     console.error("❌ Model invocation failed:", err);
//     throw err;
//   }
// }

// // Graph Node: Custom Tool Executor Step
// async function executeShowDataTool(state: AppState): Promise<Partial<AppState>> {
//   const lastMessage = state.messages[state.messages.length - 1];
//   let toolMessage: ToolMessage | null = null;
//   let nextIndex = state.index; // Use index from state

//   // Ensure the last message is an AI message with tool calls
//   if (lastMessage?._getType() === "ai" && (lastMessage as AIMessage).tool_calls?.length) {
//     const toolCall = (lastMessage as AIMessage).tool_calls?.find(
//       (call) => call.name === "show_data"
//     );

//     if (toolCall) {
//       console.log(`🛠️ Executing show_data tool (index: ${state.index}) and tool id is: ${toolCall.id}`);
//       const toolOutput = fetchDataBatch(state.index); // Call the logic directly
//       nextIndex = state.index + 1; // Increment index for the next potential call
//       toolMessage = new ToolMessage({
//           content: toolOutput,
//           tool_call_id: toolCall.id!, // Ensure id is passed
//       });
//       console.log(` MTool output: ${toolOutput}`);
//     } else {
//         console.warn("❓ Expected tool call to 'show_data' not found in last AI message.");
//         // Decide how to handle this - maybe create an error message or proceed cautiously.
//         // For now, we'll just not produce a tool message.
//     }
//   } else {
//        console.warn("❓ Tool node called without a preceding AI tool call message.");
//        // Handle cases where this node might be reached unexpectedly.
//   }

//   // Return the updated index and the new tool message (if any)
//   // LangGraph's state reducer will append the message automatically
//   return {
//     index: nextIndex,
//     messages: toolMessage ? [toolMessage] : [],
//   };
// }

// // --- Edge Routing ---

// // Route from Agent: Decide if we need to call tools or end
// function routeFromAgent(state: AppState): "tools" | "__end__" {
//   const lastMessage = state.messages[state.messages.length - 1];

//   if (lastMessage?._getType() === "ai" && (lastMessage as AIMessage).tool_calls?.length) {
//     // Check if the specific tool we care about was called
//     const hasShowDataCall = (lastMessage as AIMessage).tool_calls?.some(
//       (call) => call.name === "show_data"
//     );
//     if (hasShowDataCall) {
//         console.log("🚦 Agent requested 'show_data'. Routing to tools.");
//         return "tools";
//     } else {
//         console.log("🚦 Agent requested a different tool (or none relevant). Ending.");
//         return "__end__"; // Or handle other tools if necessary
//     }
//   }
//   // If no tool call, the agent gave its final response based on current info
//   console.log("🚦 Agent provided final response. Ending.");
//   return "__end__";
// }

// // Route AFTER Tool Execution: Check tool output before going back to agent
// function routeAfterTool(state: AppState): "agent" | "__end__" {
//   const lastMessage = state.messages[state.messages.length - 1];

//   // Check if the last message is the ToolMessage from our custom node
//   if (lastMessage?._getType() === "tool") {
//     // Check the content of the tool message
//     const toolOutput = lastMessage.content?.toString() ?? "";
//     if (toolOutput === "No more data.") {
//       console.log("⛔ Tool reported 'No more data.'. Ending flow.");
//       return "__end__";
//     } else {
//       console.log("🔁 Tool provided data. Routing back to agent for analysis.");
//       return "agent";
//     }
//   }

//   // Should not happen in the designed flow, but good to handle
//   console.warn("🚦 Routing after tool, but last message wasn't a ToolMessage. Ending.");
//   return "__end__";
// }

// // --- Graph Construction ---
// const workflow = new StateGraph<AppState>({ channels: AppStateAnnotation }) // Use AppState
//   .addNode("agent", callModel)
//   .addNode("tools", executeShowDataTool) // Use the custom tool executor node
//   .setEntryPoint("agent") // Start with the agent
//   .addConditionalEdges("agent", routeFromAgent, {
//     tools: "tools",
//     __end__: "__end__",
//   })
//   .addConditionalEdges("tools", routeAfterTool, { // Conditional edge AFTER tools
//     agent: "agent",
//     __end__: "__end__",
//   });
//   // Removed the direct edge: .addEdge("tools", "agent")

// // Compiled Graph
// export const langapp = workflow.compile();