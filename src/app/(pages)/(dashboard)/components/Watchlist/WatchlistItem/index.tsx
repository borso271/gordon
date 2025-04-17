import React from "react";
import styles from "./WatchlistItem.module.css"; // reuse styles
import SymbolTitle from "../SymbolTitle";
import ValueTrend from "../../../../../../components/ValueTrend";
import ActionsPart from "../../Portfolio/components/ActionsPart";
import { SimpleTicker } from "../../../../../../interfaces";
type WatchlistItemProps = {
  item: WatchlistItem
};


type WatchlistItem = {
    id: number;
    name: string;
    ticker: string;
    asset_type: "stock" | "etf" | "crypto";
    last_price: number | null;
    last_close: number | null;
  };
  

export function convertToSimpleTicker(item: WatchlistItem): SimpleTicker {
    return {
      symbol_id: item.id,
      ticker: item.ticker,
      name: item.name,
      asset_type: item.asset_type,
    };
  }

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
  const price = item.last_price ?? item.last_close ?? 1;
  const priceDisplay = price.toFixed(2);

  const percentChange =
    typeof item.last_close === "number" &&
    item.last_close !== 0 &&
    typeof item.last_price === "number"
      ? ((item.last_price - item.last_close) / item.last_close) * 100
      : null;

  return (
    <tr className={styles.tr}>
      <td className={styles.td}>
        <SymbolTitle
          name={item.name}
          ticker={item.ticker}
          asset_type={item.asset_type}
        />
      </td>
    <td className={`${styles.td} ${styles.values}`}>
        {percentChange !== null ? (
          <ValueTrend value={percentChange} />
        ) : (
          "N/A"
        )}
          <ValueTrend value={price} isPercentage={false} currencySymbol={"$"} applyColor={false}/>
      </td>
      <td className={styles.td}>
      <ActionsPart item={convertToSimpleTicker(item)} />
      </td>
    </tr>
  );
};

export default WatchlistItem;
