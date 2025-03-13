/*
the suggestion component will be shown if gpt calls for suggestions.
It should also take a symbol as prop,
but for now always returning the same symbols, apple 6 times over.
*/


import React from "react";
import styles from "./Suggestion.module.css";
import SuggestedSymbols from "./components/SuggestedSymbols";
import BotHeading from "../Headings/BotHeading";
const Suggestion = ({data, handleManualFunctionCall}) => {

    const symbol = data.symbol;
  return (
    <div className={styles.suggestionContainer}>
      <BotHeading>Here's some ideas:</BotHeading>
      <SuggestedSymbols data={data} handleManualFunctionCall={handleManualFunctionCall} />
    
    </div>
  );
};

export default Suggestion;
