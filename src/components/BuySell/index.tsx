/*
Now I need a 
*/

import React, { useEffect, useState } from "react";
import styles from "./BuySell.module.css";
import TickerSearch from "./components/TickerSearch";
import TransactionPreview from "./components/TransactionPreview";
import Icon from "../Icons/Icon";
import SymbolIcon from "../Icons/SymbolIcon";


import { SimpleTicker } from "../../interfaces";


const DEFAULT_USER_ID = "abc";

const BuySell: React.FC<{ tickerToBuy?: SimpleTicker | null; onPlaceOrder: any }> = ({ tickerToBuy=null, onPlaceOrder }) => {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  const [selectedStock, setSelectedStock] = useState<SimpleTicker | null>(tickerToBuy);

  const [ownedShares, setOwnedShares] = useState<number>(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);


const [buyingPower, setBuyingPower] = useState<number>(0);

useEffect(() => {
  const fetchBuyingPower = async () => {
    try {
      const res = await fetch("/api/fetch_buying_power", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: DEFAULT_USER_ID,
        }),
      });

      const data = await res.json();
      setBuyingPower(data.cash || 0);
    } catch (err) {
      console.error("❌ Error fetching buying power:", err);
      setBuyingPower(0);
    }
  };

  fetchBuyingPower();
}, []);

  useEffect(() => {
    const fetchOwnedShares = async () => {
      if (!selectedStock) return;

      try {
        const res = await fetch("/api/fetch_user_shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: DEFAULT_USER_ID,
            symbol_id: selectedStock.symbol_id,
          }),
        });

        const data = await res.json();
        setOwnedShares(data.quantity || 0);
      } catch (err) {
        console.error("❌ Error fetching owned shares:", err);
        setOwnedShares(0);
      }
    };

    fetchOwnedShares();
  }, [selectedStock]);

  const [stocks, setStocks] = useState<SimpleTicker[]>([]);
  useEffect(() => {
    const fetchStocks = async () => {
      const cached = localStorage.getItem("tickers");
      const timestamp = localStorage.getItem("tickers_timestamp");
      const THIRTY_MINUTES = 10000 * 60 * 1000;
  
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

  const canSell = ownedShares > 0;

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Quick Transaction</h2>
      </div>

      <div className={styles.transactionBox}>
        <div className={styles.buttonRow}>
          <button
            className={`${styles.tbutton} ${transactionType === "buy" ? styles.active : ""}`}
            onClick={() => setTransactionType("buy")}
          >
            Buy
          </button>

          <button
            className={`${styles.tbutton} ${transactionType === "sell" ? styles.active : ""}`}
            onClick={() => setTransactionType("sell")}
            disabled={!canSell}
          >
            Sell
          </button>
        </div>

        <div className={styles.dropdownWrapper}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={styles.dropdownHeader}
          >
            <div className={styles.dropdownLabel}>
              {selectedStock ? (
                <div className={styles.selectedContent}>
                  <SymbolIcon
                    asset_type={selectedStock.asset_type}
                    ticker_symbol={selectedStock.ticker}
                    size={32}
                  />
                  <span className={styles.stockName}>{selectedStock.name}</span>
                </div>
              ) : (
                "Select a Ticker"
              )}
            </div>
            <Icon name="chevron_down" />
          </div>

          {isDropdownOpen ? (
            <TickerSearch
            stocks = {stocks}
              onSelectStock={(stock) => {
                setSelectedStock(stock);
                setIsDropdownOpen(false);
              }}
            />
          ) : (
            <TransactionPreview
              selectedStock={selectedStock}
              ownedShares={ownedShares}
              buyPower={buyingPower}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySell;
