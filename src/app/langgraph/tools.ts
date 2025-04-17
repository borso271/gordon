// tools.ts
import { DynamicStructuredTool } from "@langchain/core/tools";

let index = 0;
const dataBatches = [
  "📊 Revenue grew 15% YoY",
  "💰 Net income decreased by 10%",
  "📉 Debt reduced by 5%",
];

export const showDataTool = new DynamicStructuredTool({
  name: "show_data",
  description: "Show the next batch of financial data for analysis",
  schema: {}, // no arguments needed
  func: async () => {
    const data = dataBatches[index] ?? "No more data.";
    index++;
    return data;
  },
});
