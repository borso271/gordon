// TickerSearch.tsx

import React, { useEffect, useState, useMemo } from "react";
import styles from "./TickerSearch.module.css"; // You'll style it next
import SymbolTitle from "../../../../app/(pages)/(dashboard)/components/Watchlist/SymbolTitle";


type Props = {
  onSelectStock: (stock: Stock) => void;
};

type Stock = {
  symbol_id: number;
  ticker: string;
  name: string;
  asset_type: "stock" | "crypto" | "etf";
  price: number;
  last_close:number;
};


const TickerSearch: React.FC<Props> = ({ onSelectStock }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"stock" | "crypto" | "etf" | "all">("all");

  useEffect(() => {
    const fetchStocks = async () => {
      const cached = localStorage.getItem("tickers");
      const timestamp = localStorage.getItem("tickers_timestamp");
      const THIRTY_MINUTES = 30 * 60 * 1000;
  
      const now = Date.now();
      const isFresh = timestamp && now - parseInt(timestamp) < THIRTY_MINUTES;
  
      if (cached && isFresh) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            console.log("✅ Using cached tickers");
            setStocks(parsed);
            return;
          }
        } catch (e) {
          console.error("❌ Failed to parse cached tickers", e);
        }
      }
  
      // If no cache or cache is stale
      try {
        console.log("🌐 Fetching fresh tickers from API");
        const res = await fetch("/api/all_tickers");
        const data = await res.json();
  
        setStocks(data);
        localStorage.setItem("tickers", JSON.stringify(data));
        localStorage.setItem("tickers_timestamp", now.toString());
      } catch (err) {
        console.error("❌ Error fetching tickers", err);
      }
    };
  
    fetchStocks();
  }, []);
  
  const filteredStocks = useMemo(() => {


    let result = [...stocks];

    if (filter !== "all") {
      result = result.filter((s) => s.asset_type === filter);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((s) =>
        s.ticker.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    return result.sort((a, b) => a.ticker.localeCompare(b.ticker));
  }, [stocks, searchTerm, filter]);

  return (
    <div className={styles.container}>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search ticker..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter buttons */}
      <div className={styles.filterButtons}>
        {["all", "stock", "crypto", "etf"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`${styles.filterButton} ${
              filter === type ? styles.active : ""
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className={styles.resultList}>
      {filteredStocks.slice(0, 20).map((stock) => {
    const change =
      stock.last_close && stock.last_close > 0
        ? ((stock.price - stock.last_close) / stock.last_close) * 100
        : null;

    const isPositive = change !== null && change >= 0;

    return (
       
      <div
        key={stock.symbol_id}
        className={styles.resultRow}
        onClick={() => onSelectStock(stock)}
      >
        {/* Column 1: Ticker + Name */}
        <div className={styles.assetName}>
        <SymbolTitle name={stock.name} ticker={stock.ticker} asset_type={stock.asset_type} />
        {/* {stock.name} */}
        </div>

        {/* Column 2: % Change */}
        <div
          className={`${styles.changeValue} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          {change !== null ? `${change.toFixed(2)}%` : "—"}
        </div>

        {/* Column 3: Current Price */}
        <div
          className={`${styles.priceValue} ${
            isPositive ? styles.positive : styles.negative
          }`}
        >
          ${stock.price.toFixed(2)}
        </div>
      </div>
    );
  })}
</div>
    </div>
  );
};

export default TickerSearch;
