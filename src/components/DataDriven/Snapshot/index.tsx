
import React from "react";
import styles from "./Snapshot.module.css";
import SymbolIcon from "../../Icons/SymbolIcon";
import SnapshotLoader from "../../Loaders/SnapshotLoader";
import { formatNumberWithCommas} from "../../../app/utils/formatNumbersWithCommas"
import { useSymbolSnapshot } from "../../../app/hooks/useSymbolSnapshot";

interface SymbolSnapshotProps {
  symbol: string;
  onClick: () => void;
  icon: boolean;
}

const SymbolSnapshot: React.FC<SymbolSnapshotProps> = ({ symbol, onClick, icon }) => {
  const {
    snapshot,
    asset_type,
    symbol_name,
    lastLivePrice,
    percentageChange,
  } = useSymbolSnapshot(symbol);

  const changeClass = percentageChange >= 0 ? styles.positive : styles.negative;

  if (!snapshot) return <SnapshotLoader />;

  return (
    <div className={styles.snapshot} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <SymbolIcon asset_type={asset_type} ticker_symbol={symbol} size={50} />
      </div>

      <div className={styles.symbolContainer}>
        <div className={styles.symbol}>{symbol.toUpperCase()}</div>
        <div className={styles.symbolName}>{symbol_name}</div>
      </div>

      <div className={styles.priceContainer}>
        <div className={styles.price}>
          {lastLivePrice !== null ? `$${formatNumberWithCommas(lastLivePrice)}` : "-"}
        </div>
        <div className={`${styles.change} ${changeClass}`}>
          {percentageChange !== null
            ? `${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(2)}%`
            : "—"}
        </div>
      </div>
    </div>
  );
};

export default SymbolSnapshot;
