import React from "react";
import styles from "./WatchlistItem.module.css";
import SymbolTitle from "../SymbolTitle";
import ValueTrend from "../../../../../../components/ValueTrend";
import ActionsPart from "../../Portfolio/components/ActionsPart";
import { SimpleTicker } from "../../../../../../interfaces";

type WatchlistItem = {
  id: number;
  name: string;
  ticker: string;
  asset_type: "stock" | "etf" | "crypto";
  last_price: number | null;
  last_close: number | null;
};

type WatchlistItemProps = { item: WatchlistItem };

function convertToSimpleTicker(item: WatchlistItem): SimpleTicker {
  return {
    symbol_id: item.id,
    ticker: item.ticker,
    name: item.name,
    asset_type: item.asset_type,
  };
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
  const price = item.last_price ?? item.last_close ?? 1;
  const percentChange =
    typeof item.last_close === "number" &&
    item.last_close !== 0 &&
    typeof item.last_price === "number"
      ? ((item.last_price - item.last_close) / item.last_close) * 100
      : null;

  return (
    <div className={styles.row}>
      {/* left: symbol */}
      <div className={styles.cellSymbol}>
        <SymbolTitle
          name={item.name}
          ticker={item.ticker}
          asset_type={item.asset_type}
        />
      </div>

      {/* middle: price + change */}
      <div className={styles.cellValues}>
        <ValueTrend value={price} isPercentage={false} currencySymbol="$" applyColor={false} />
        {percentChange !== null ? (
          <ValueTrend value={percentChange} />
        ) : (
          <span className={styles.na}>N/A</span>
        )}
      </div>

      {/* right: actions */}
      <div className={styles.cellActions}>
        <ActionsPart item={convertToSimpleTicker(item)} />
      </div>
    </div>
  );
};

export default WatchlistItem;

// import React from "react";
// import styles from "./WatchlistItem.module.css"; // reuse styles
// import SymbolTitle from "../SymbolTitle";
// import ValueTrend from "../../../../../../components/ValueTrend";
// import ActionsPart from "../../Portfolio/components/ActionsPart";
// import { SimpleTicker } from "../../../../../../interfaces";
// type WatchlistItemProps = {
//   item: WatchlistItem
// };


// type WatchlistItem = {
//     id: number;
//     name: string;
//     ticker: string;
//     asset_type: "stock" | "etf" | "crypto";
//     last_price: number | null;
//     last_close: number | null;
//   };
  

// export function convertToSimpleTicker(item: WatchlistItem): SimpleTicker {
//     return {
//       symbol_id: item.id,
//       ticker: item.ticker,
//       name: item.name,
//       asset_type: item.asset_type,
//     };
//   }

// const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
//   const price = item.last_price ?? item.last_close ?? 1;
//   const priceDisplay = price.toFixed(2);

//   const percentChange =
//     typeof item.last_close === "number" &&
//     item.last_close !== 0 &&
//     typeof item.last_price === "number"
//       ? ((item.last_price - item.last_close) / item.last_close) * 100
//       : null;

//   return (
//     <tr className={styles.tr}>
//       <td className={styles.td}>
//         <SymbolTitle
//           name={item.name}
//           ticker={item.ticker}
//           asset_type={item.asset_type}
//         />
//       </td>
//     <td className={`${styles.td} ${styles.values}`}>
       
//           <ValueTrend value={price} isPercentage={false} currencySymbol={"$"} applyColor={false}/>
//           {percentChange !== null ? (
//           <ValueTrend value={percentChange} />
//         ) : (
//           "N/A"
//         )}
//       </td>
//       <td className={styles.td}>
//       <ActionsPart item={convertToSimpleTicker(item)} />
//       </td>
//     </tr>
//   );
// };

// export default WatchlistItem;
