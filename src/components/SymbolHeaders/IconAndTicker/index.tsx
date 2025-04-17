import React from "react";
import styles from "./IconAndTicker.module.css";
import SymbolIcon from "../../Icons/SymbolIcon";

type Props = {
  ticker: string;
  name: string;
  asset_type?: "stock" | "crypto" | "etf";
  symbol?: string;
  icon?: boolean;
  iconSize?: number;
};

const IconAndTicker: React.FC<Props> = ({
  ticker,
  name,
  asset_type,
  symbol,
  icon = true,
  iconSize = 32,
}) => {
  return (
    <div className={styles.symbolTitle}>
      {icon && (
        <div className={styles.iconWrapper}>
          <SymbolIcon
            asset_type={asset_type}
            ticker_symbol={symbol ?? ticker}
            size={iconSize}
          />
        </div>
      )}
      <div className={styles.labelWrapper}>
        <div className={styles.ticker}>{ticker}</div>
     
      </div>
    </div>
  );
};

export default IconAndTicker;
