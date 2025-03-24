import React from "react";
import styles from "./SymbolIcon.module.css";

interface SymbolIconProps {
  asset_type: "stock" | "crypto" | string; // tighten type if you know all possible values
  ticker_symbol: string;
  size?: number;
}

const SymbolIcon: React.FC<SymbolIconProps> = ({
  asset_type,
  ticker_symbol,
  size = 40,
}) => {
  const formattedSymbol =
    asset_type === "crypto"
      ? `_c_${ticker_symbol.toUpperCase()}`
      : ticker_symbol.toUpperCase();

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
