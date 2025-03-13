import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import { useConversation } from "../../../app/context/conversationContext"; // ✅ Import context

export function useManualFunctionCall() {
  const { setConversationPairs, setCurrentIndex } = useConversation(); // ✅ Get state from context

  // ✅ Define the function inside the hook
  const handleManualFunctionCall = useCallback(
    
    async (functionName: string, args: any, functionCallHandler: (toolCall: any) => Promise<string>) => {
      // 1️⃣ Simulate user input (so it appears in conversation history)
      const userQuery =
        functionName === "suggest_securities"
          ? "Suggest some stocks or cryptos"
          : `Give me your analysis of ${args.symbol}`;

      const newPairId = uuidv4(); // ✅ Generate unique ID for this pair

      setConversationPairs((prev) => [
        ...prev,
        {
          id: newPairId, // ✅ Assign a unique id
          user: userQuery,
          assistant: "",
        },
      ]);

      setCurrentIndex((prev) => prev + 1); // ✅ Move to new conversation pair

      // 2️⃣ Call the function handler manually
      const toolCall = {
        function: { name: functionName, arguments: JSON.stringify(args) },
      };

      const result = await functionCallHandler(toolCall);
      const parsedResult = JSON.parse(result);

      // 3️⃣ Store the result properly in the correct conversation pair
      setConversationPairs((prev) =>
        prev.map((pair) =>
          pair.id === newPairId
            ? {
                ...pair,
                ...(functionName === "analyze_security"
                  ? { analysisData: parsedResult }
                  : functionName === "suggest_securities"
                  ? { suggestionData: parsedResult }
                  : {}),
              }
            : pair
        )
      );
    },
    [setConversationPairs, setCurrentIndex]
  );

  return { handleManualFunctionCall }; // ✅ Return function
}
