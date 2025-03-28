
import { useConversation } from "../context/conversationContext";
import { useHandleSubmit } from "./useHandleSubmit";
import { useLanguage } from "./useLanguage";
import { languageMap } from "../../constants";
export function useInsightsClick() {
  const { setUserInput } = useConversation();
  const { handleSubmit } = useHandleSubmit();
  const { currentLang } = useLanguage();
  const userLanguage = languageMap[currentLang];

  function onInsightsClick(row: Record<string, any>) {
    const name = row.name || row.Name || "this company";
    const ticker = row.ticker || row.symbol || "";

    const friendlyPrompt =
      currentLang === "ar"
        ? `أخبرني بالمزيد عن ${name}`
        : `Tell me more about ${name}`;

    const customQuery = `Explain to the user what you know about the security "${name}" with symbol "${ticker}". You may also search the web to give the latest news or info you might not have on this company. Reply in the user language which is: ${userLanguage}`;

    setUserInput(friendlyPrompt);
    handleSubmit(null, false, customQuery);
  }

  return { onInsightsClick };
}
