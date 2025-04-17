// run.ts
import { langapp } from "./agent";
import { HumanMessage } from "@langchain/core/messages";

(async () => {
  const result = await langapp.invoke({
    messages: [
      new HumanMessage("Can you show me the financial data and explain it step by step?")
    ],
  });

  result.messages.forEach((msg) => {
    console.log(`${msg._getType()}: ${msg.content}`);
  });
})();
