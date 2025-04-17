import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { showDataTool } from "./tools"; // update to your actual tool import

// Tools
const tools = [showDataTool];

// Model with debugging
// e.g., ensure streaming: true
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  streaming: true,       // <- crucial
  temperature: 0,
  useResponsesApi: true,
}).bindTools(tools);

// Graph Node: Agent Step
async function callModel(state: typeof MessagesAnnotation.State) {
  console.log("🧠 Calling model with messages:", state.messages);
  try {
    const res = await model.invoke(state.messages);
    console.log("📥 Model response:", res);
    return { messages: [res] };
  } catch (err) {
    console.error("❌ Model invocation failed:", err);
    throw err;
  }
}

// Graph Node: Tool Step
const toolNode = new ToolNode(tools);

// Edge Routing


function routeFromModel({ messages }: typeof MessagesAnnotation.State) {
  const last = messages[messages.length - 1];

  // If the model just made a tool call
  if (last._getType?.() === "ai" && (last as AIMessage).tool_calls?.length) {
    console.log("🔧 Detected tool call. Routing to tools.");
    return "tools";
  }
  // If the model just responded after tool output
  if (last._getType?.() === "ai") {
    const previousToolMessage = messages
      .slice()
      .reverse()
      .find((m) => m._getType?.() === "tool");

    const toolOutput = previousToolMessage?.content?.toString() ?? "";
    if (toolOutput === "No more data.") {
      console.log("⛔ No more data — ending flow.");
      return "__end__";

    }

    console.log("🔁 Continuing loop for next data batch...");
    return "tools";
  }

  console.log("🛑 Unexpected message state. Ending just in case.");
  return "__end__";
}


// Graph Construction
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", routeFromModel);

// Compiled Graph
export const langapp = workflow.compile();
