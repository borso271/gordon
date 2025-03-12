import React from "react";
import styles from "./SymbolIcon.module.css";

const SymbolIcon = ({ ticker_symbol, size = 40 }) => {
  return (
    <div className={styles.iconContainer} style={{ width: size, height: size }}>
      <img
        src={`/symbol_icons/${ticker_symbol.toUpperCase()}.svg`}
        alt={`${ticker_symbol} logo`}
        className={styles.icon}
      />
    </div>
  );
};

export default SymbolIcon;
