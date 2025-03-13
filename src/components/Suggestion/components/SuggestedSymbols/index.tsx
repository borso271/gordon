/* Do the similar stock component taking from the database,
but first do the actual snapshot.

Then do the response parts */
import React from "react";
import styles from "./SuggestedSymbols.module.css";
import SymbolSnapshot from "../../../DataDriven/Snapshot";

interface SuggestedSymbolsProps {
  data: { suggestions: { symbol: string; asset_type: string; exchange_mic: string }[] };
  handleManualFunctionCall: (functionName: string, args: any) => void;
}

const SuggestedSymbols: React.FC<SuggestedSymbolsProps> = ({ data, handleManualFunctionCall }) => {
  return (
    <div className={styles.cardsContainer}>
      {data.suggestions.map((item, index) => (
        <SymbolSnapshot
          key={index}
          onClick={() =>
            handleManualFunctionCall("analyze_security", {
              language: "en",
              symbol: item.symbol,
              asset_type: item.asset_type,
            })
          }
          symbol={item.symbol}
          icon={true}
        />
      ))}
    </div>
  );
};

export default SuggestedSymbols;
