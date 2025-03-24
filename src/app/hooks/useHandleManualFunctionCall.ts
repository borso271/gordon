import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import { useConversation } from "../context/conversationContext"; // ✅ Import context
import { useLanguage } from "./useLanguage";
export function useManualFunctionCall() {
  const { setConversationPairs, setCurrentIndex } = useConversation();
  const { t } = useTranslation(); // ✅ Add this
  const {currentLang} = useLanguage() 
  
  const handleManualFunctionCall = useCallback(
    async (
      functionName: string,
      args: any,
      functionCallHandler: (toolCall: any) => Promise<string>
    ) => {
      // 🧠 Use translation for the user query
      const userQuery =
        functionName === "suggest_securities"
          ? t("user_query_suggest") // e.g., "Suggest stocks or cryptos"
          : t("user_query_analyze", { symbol: args.symbol }); // e.g., "Give me your analysis of AAPL"

      const newPairId = uuidv4();
      setConversationPairs((prev) => {
        const updatedPairs = [
          ...prev,
          {
            id: newPairId,
            user: userQuery,
            assistant: "",
            language: currentLang
          },
        ];
        setCurrentIndex(updatedPairs.length - 1);
        return updatedPairs;
      });

      const toolCall = {
        function: { name: functionName, arguments: JSON.stringify(args) },
      };

      const result = await functionCallHandler(toolCall);
      const parsedResult = JSON.parse(result);

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
    [setConversationPairs, setCurrentIndex, t] // ✅ Add `t` to deps
  );

  return { handleManualFunctionCall };
}


// export function useManualFunctionCall() {
//   const { setConversationPairs, setCurrentIndex } = useConversation(); // ✅ Get state from context

//   // ✅ Define the function inside the hook
//   const handleManualFunctionCall = useCallback(

//     async (functionName: string, args: any, functionCallHandler: (toolCall: any) => Promise<string>) => {
//       // 1️⃣ Simulate user input (so it appears in conversation history)
    
//       const userQuery =
//         functionName === "suggest_securities"
//           ? "Suggest stocks or cryptos"
//           : `Give me your analysis of ${args.symbol}`;

//       const newPairId = uuidv4(); // ✅ Generate unique ID for this pair
//       setConversationPairs((prev) => {
//         const updatedPairs = [
//           ...prev,
//           {
//             id: newPairId, // ✅ Assign a unique id
//             user: userQuery,
//             assistant: "",
//           },
//         ];
        
//         setCurrentIndex(updatedPairs.length - 1); // ✅ Set index to the latest message
//         return updatedPairs;
//       });
      
//       // 2️⃣ Call the function handler manually
//       const toolCall = {
//         function: { name: functionName, arguments: JSON.stringify(args) },
//       };

//       const result = await functionCallHandler(toolCall);
//       const parsedResult = JSON.parse(result);

//       // 3️⃣ Store the result properly in the correct conversation pair
//       setConversationPairs((prev) =>
//         prev.map((pair) =>
//           pair.id === newPairId
//             ? {
//                 ...pair,
//                 ...(functionName === "analyze_security"
//                   ? { analysisData: parsedResult }
//                   : functionName === "suggest_securities"
//                   ? { suggestionData: parsedResult }
//                   : {}),
//               }
//             : pair
//         )
//       );
//     },
//     [setConversationPairs, setCurrentIndex]
//   );

//   return { handleManualFunctionCall }; // ✅ Return function
// }
