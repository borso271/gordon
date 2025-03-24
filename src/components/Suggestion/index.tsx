import React from "react";
import styles from "./Suggestion.module.css";
import SuggestedSymbols from "./components/SuggestedSymbols";
import BotHeading from "../Headings/BotHeading";

interface SuggestionProps {
  data: any; // Replace `any` with your real type if available
  language: string;
  handleManualFunctionCall: (action: string, payload: any) => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ data, language, handleManualFunctionCall }) => {
  const headingText =
    language === "ar" ? "إليك بعض الأفكار" : "Here's some ideas";

  return (
    <div className={styles.suggestionContainer}>
      <BotHeading>{headingText}</BotHeading>
      <SuggestedSymbols data={data} handleManualFunctionCall={handleManualFunctionCall} />
    </div>
  );
};

export default Suggestion;
