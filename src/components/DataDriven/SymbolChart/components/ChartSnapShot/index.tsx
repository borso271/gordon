import React from "react";
import styles from "./ChartSnapshot.module.css"; // Assuming styles are here
import Icon from "../../../../Icons/Icon";
import SymbolIcon from "../../../../Icons/SymbolIcon";
import { formatNumberWithCommas } from "../../../../../app/utils/formatNumbersWithCommas";
import { useChartSnapshot } from "../../../../../app/hooks/useChartSnapshot";

interface ChartSnapshotProps {
  symbol: string;
  name: string;
  latestPrice: number | null;
  lastClose: number | null;
  language: string;
  currency: string;
  asset_type: string;
  icon?: boolean;
}

const ChartSnapshot: React.FC<ChartSnapshotProps> = ({
  symbol,
  name,
  latestPrice,
  lastClose,
  language,
  currency,
  asset_type,
  icon = true,
}) => {
  const { percentageChange, changeClass, trendIcon, iconSize } = useChartSnapshot(latestPrice, lastClose);

  const snapshotPrice =
    latestPrice !== null ? `${currency} ${formatNumberWithCommas(latestPrice)}` : "";

  return (
    <div className={styles.snapshot}>
      <div className={styles.iconWrapper}>
        {icon && (
          <SymbolIcon asset_type={asset_type} ticker_symbol={symbol} size={iconSize} />
        )}
      </div>

      <div className={styles.metadata}>
        <div className={styles.symbol}>
          {name} • {symbol.toUpperCase()}
        </div>

        <div className={styles.priceData}>
          <div className={styles.price}>{snapshotPrice}</div>

          <div className={`${styles.change} ${styles[changeClass]}`}>
            <Icon name={trendIcon} size={12} />
            {percentageChange !== null ? `${percentageChange.toFixed(2)}%` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSnapshot;
