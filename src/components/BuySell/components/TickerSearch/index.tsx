// TickerSearch.tsx

import React, { useEffect, useState, useMemo } from "react";
import styles from "./TickerSearch.module.css"; // You'll style it next
import SymbolTitle from "../../../../app/(pages)/(dashboard)/components/Watchlist/SymbolTitle";

import { useTranslation } from "react-i18next";
interface SimpleTicker {
  symbol_id: number;
  ticker: string;
  name: string;
  asset_type: "stock" | "crypto" | "etf";
}

interface Props {
  stocks: SimpleTicker[];
  onSelectStock: (stock: SimpleTicker) => void;
}

const TickerSearch: React.FC<Props> = ({ stocks, onSelectStock }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"stock" | "crypto" | "etf" | "all">("all");

  /* ---------- Memo‑filtered list ---------- */
  const filteredStocks = useMemo(() => {
    let result = [...stocks];
    if (filter !== "all") result = result.filter((s) => s.asset_type === filter);
    if (searchTerm.trim())
      result = result.filter((s) =>
        s.ticker.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    return result.sort((a, b) => a.ticker.localeCompare(b.ticker));
  }, [stocks, searchTerm, filter]);

  /* ---------- Rendering ---------- */
  return (
    <div className={styles.container}>
      {/* Search bar */}
      <input
        type="text"
        placeholder={t("ticker_search.placeholder")}
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter buttons */}
      <div className={styles.filterButtons}>
        {(["all", "stock", "crypto", "etf"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`${styles.filterButton} ${
              filter === type ? styles.active : ""
            }`}
          >
            {t(`ticker_search.filter.${type}`)}
          </button>
        ))}
      </div>

      {/* Scrollable result list */}
      <div className={styles.resultList}>
        {filteredStocks.slice(0, 20).map((stock) => (
          <div
            key={stock.symbol_id}
            className={styles.resultRow}
            onClick={() => onSelectStock(stock)}
          >
            <SymbolTitle
              name={stock.name}
              ticker={stock.ticker}
              asset_type={stock.asset_type}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerSearch;

// const TickerSearch: React.FC<Props> = ({ stocks,onSelectStock }) => {
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState<"stock" | "crypto" | "etf" | "all">("all");

  
//   const filteredStocks = useMemo(() => {

//     let result = [...stocks];

//     if (filter !== "all") {
//       result = result.filter((s) => s.asset_type === filter);
//     }

//     if (searchTerm.trim() !== "") {
//       result = result.filter((s) =>
//         s.ticker.toLowerCase().startsWith(searchTerm.toLowerCase())
//       );
//     }

//     return result.sort((a, b) => a.ticker.localeCompare(b.ticker));
//   }, [stocks, searchTerm, filter]);

//   return (
//     <div className={styles.container}>
//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search ticker..."
//         className={styles.searchBar}
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {/* Filter buttons */}
//       <div className={styles.filterButtons}>
//         {["all", "stock", "crypto", "etf"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setFilter(type as any)}
//             className={`${styles.filterButton} ${
//               filter === type ? styles.active : ""
//             }`}
//           >
//             {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Scrollable list */}
//       <div className={styles.resultList}>
//       {filteredStocks.slice(0, 20).map((stock) => {
//     // const change =
//     //   stock.last_close && stock.last_close > 0
//     //     ? ((stock.price - stock.last_close) / stock.last_close) * 100
//     //     : null;

//     // const isPositive = change !== null && change >= 0;

//     return (
       
//       <div
//         key={stock.symbol_id}
//         className={styles.resultRow}
//         onClick={() => onSelectStock(stock)}
//       >
//         {/* Column 1: Ticker + Name */}
//         <div className={styles.assetName}>
//         <SymbolTitle name={stock.name} ticker={stock.ticker} asset_type={stock.asset_type} />
//         {/* {stock.name} */}
//         </div>

//       </div>
//     );
//   })}
// </div>
//     </div>
//   );
// };

// export default TickerSearch;
