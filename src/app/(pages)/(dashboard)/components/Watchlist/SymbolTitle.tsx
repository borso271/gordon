import React from "react";
import styles from "./SymbolTitle.module.css";
import SymbolIcon from "../../../../../components/Icons/SymbolIcon";
import e from "cors";

type Props = {
  ticker: string;
  name: string;
  asset_type?: "stock" | "crypto" | "etf";
  symbol?: string;
  icon?: boolean;
  iconSize?: number;
};
const SymbolTitle: React.FC<Props> = ({
  ticker,
  name,
  asset_type,
  symbol,
  icon = true,
  iconSize = 40,
}) => {
  return (
    <div className={styles.symbolTitle}  style={{  height: iconSize }}>
      {icon && (
        <div
          className={styles.iconWrapper}
          style={{ width: iconSize, height: iconSize }}
        >
          <SymbolIcon
            asset_type={asset_type}
            ticker_symbol={symbol ?? ticker}
            size={iconSize}
          />
        </div>
      )}
      <div className={styles.labelWrapper}>
        <div className={styles.ticker}>{ticker}</div>
        <div className={styles.name}>{name}</div>
      </div>
    </div>
  );
};

export default SymbolTitle