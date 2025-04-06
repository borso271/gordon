import { BotMessagePart } from "../../interfaces";
export function createQueryFromBotParts(
    botParts: BotMessagePart[],
    maxChars: number = 500
  ): string {
    if (!Array.isArray(botParts)) return "";
  
    const fullText = botParts
      .filter((part) => part.type === "assistantText")
      .map((part) => part.content.trim())
      .join(" ")
      .trim();
  
    return fullText.slice(0, maxChars);
  }