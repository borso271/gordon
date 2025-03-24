import React from "react";
import styles from "./Suggestion.module.css";
import SuggestedSymbols from "./components/SuggestedSymbols";
import BotHeading from "../Headings/BotHeading";

interface SuggestionProps {
  data: any; // You can replace `any` with a specific type if you have one
  handleManualFunctionCall: (action: string, payload: any) => void;
}
const Suggestion: React.FC<SuggestionProps> = ({ data, handleManualFunctionCall }) => {
  return (
    <div className={styles.suggestionContainer}>
      <BotHeading>Here's some ideas:</BotHeading>
      <SuggestedSymbols data={data} handleManualFunctionCall={handleManualFunctionCall} />
    </div>
  );
};

export default Suggestion;
