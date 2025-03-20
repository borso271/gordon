import React from "react";
import styles from "./SymbolIcon.module.css";

const SymbolIcon = ({ asset_type, ticker_symbol, size = 40 }) => {
  // Add "_c_" prefix for crypto assets

  const formattedSymbol = asset_type === "crypto" ? `_c_${ticker_symbol.toUpperCase()}` : ticker_symbol.toUpperCase();
  
  return (
    <div className={styles.iconContainer} style={{ width: size, height: size }}>
      <img
        src={`/symbol_icons/${formattedSymbol}.svg`}
        alt={`${ticker_symbol} logo`}
        className={styles.icon}
      />
    </div>
  );
};

export default SymbolIcon;
