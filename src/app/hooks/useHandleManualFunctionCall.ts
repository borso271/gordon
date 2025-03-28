import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import { useConversation } from "../context/conversationContext"; // ✅ Import context
import { useLanguage } from "./useLanguage";

// export function useManualFunctionCall() {
//   const { setConversationPairs, setCurrentIndex } = useConversation();
//   const { t } = useTranslation();
//   const { currentLang } = useLanguage();
  
//   const handleManualFunctionCall = useCallback(
//     async (
//       functionName: string,
//       args: any,
//       functionCallHandler: (toolCall: any) => Promise<string>
//     ) => {
//       const userQuery =
//         functionName === "suggest_securities"
//           ? t("user_query_suggest")
//           : functionName === "analyze_security"
//           ? t("user_query_analyze", { symbol: args.symbol })
//           : functionName === "list_tickers"
//           ? t("user_query_list_tickers") // 🆕 Add translation key
//           : "";

//       const newPairId = uuidv4();
//       setConversationPairs((prev) => {
//         const updatedPairs = [
//           ...prev,
//           {
//             id: newPairId,
//             user: userQuery,
//             assistant: "",
//             language: currentLang,
//           },
//         ];
//         setCurrentIndex(updatedPairs.length - 1);
//         return updatedPairs;
//       });

//       const toolCall = {
//         function: { name: functionName, arguments: JSON.stringify(args) },
//       };

//       const result = await functionCallHandler(toolCall);
//       const parsedResult = JSON.parse(result);

//       setConversationPairs((prev) =>
//         prev.map((pair) =>
//           pair.id === newPairId
//             ? {
//                 ...pair,
//                 ...(functionName === "analyze_security"
//                   ? { analysisData: parsedResult }
//                   : functionName === "suggest_securities"
//                   ? { suggestionData: parsedResult }
//                   : functionName === "list_tickers"
//                   ? { tickerListData: parsedResult } // 🆕 Handle list_tickers
//                   : {}),
//               }
//             : pair
//         )
//       );
//     },
//     [setConversationPairs, setCurrentIndex, t]
//   );

//   return { handleManualFunctionCall };

// }


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
