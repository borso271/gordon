/* Do the similar stock component taking from the database,
but first do the actual snapshot.

Then do the response parts */

import React from "react";
import styles from "./SuggestedSymbols.module.css";
import SymbolSnapshot from "../../../data_driven/Snapshot";

const SuggestedSymbols = ({handleManualFunctionCall}) => {
  return (
   
       // arguments for the function call are: language, symbol, asset_type
      <div className={styles.cardsContainer}>
        <SymbolSnapshot  onClick={() => handleManualFunctionCall("analyze_security", { language: "en", symbol: "AAPL", asset_type:"stock" })} symbol="AAPL" icon={true} />
        <SymbolSnapshot onClick={() => handleManualFunctionCall("analyze_security", {language: "en", symbol: "AAPL", asset_type:"stock" })} symbol="AAPL" icon={true} />
        <SymbolSnapshot onClick={() => handleManualFunctionCall("analyze_security", { language: "en", symbol: "AAPL", asset_type:"stock" })} symbol="AAPL" icon={true} />

        <SymbolSnapshot onClick={() => handleManualFunctionCall("analyze_security", { language: "en", symbol: "AAPL", asset_type:"stock" })} symbol="AAPL" icon={true} />
        <SymbolSnapshot onClick={() => handleManualFunctionCall("analyze_security", { language: "en", symbol: "AAPL", asset_type:"stock" })} symbol="AAPL" icon={true} />
        <SymbolSnapshot onClick={() => handleManualFunctionCall("analyze_security", { language: "en", symbol: "AAPL", asset_type:"stock"})} symbol="AAPL" icon={true} />
      </div>
    
  );
};

export default SuggestedSymbols;
