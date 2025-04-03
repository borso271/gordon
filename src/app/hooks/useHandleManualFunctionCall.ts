import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import { useConversation } from "../context/conversationContext"; // ✅ Import context
import { useLanguage } from "./useLanguage";

/*
reorganize this ad the non manual function calls so that you have a scalable way to handle these two functionalities.


reorganize logic architecture in general
so that then it is easy to add stuff

*/

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
