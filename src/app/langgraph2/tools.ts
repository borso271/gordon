// tools.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod"; // Import zod for schema definition

// Keep data batches here, but the index is managed by the graph state
const dataBatches = [
  "📊 Revenue grew 15% YoY",
  "💰 Net income decreased by 10%",
  "📉 Debt reduced by 5%",
];

// Function to fetch data based on index - this is the core logic
export function fetchDataBatch(index: number): string {
  console.log(`🔧 Fetching data for index: ${index}`);
  const data = dataBatches[index] ?? "No more data.";
  return data;
}

// The tool definition remains, but its func will be wrapped or called differently
// We don't actually need the tool instance directly in the graph anymore
// if we create a custom node, but defining it can be useful for the LLM.
export const showDataToolDefinition = new DynamicStructuredTool({
  name: "show_data",
  description: "Show the next batch of financial data for analysis. Call this repeatedly until 'No more data.' is returned.",
  // No arguments needed *for the LLM*, but our custom node will handle the index.
  schema: z.object({}),
  func: async () => {
    // This func won't be directly called by the final graph node if we use a custom one.
    // It's primarily for the LLM's understanding and type binding.
    // Throw an error or return a placeholder if accidentally called directly by ToolNode.
    throw new Error("show_data should be executed via the custom tool node.");
  },
});