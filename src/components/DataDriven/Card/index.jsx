import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import getSecuritySnapshot from "../../../services/get_components_data/get_symbol_snapshot.js";
import styles from "./Snapshot.module.css";

// card for now has no data driven component, only the snapshot.
// Initialize Supabase Client (Replace with your keys)

const SymbolSnapshot = ({ symbol, icon = false }) => {
  const [snapshot, setSnapshot] = useState(null);
  const [lastLivePrice, setLastLivePrice] = useState(null); // Last price from Redux
  const [percentageChange, setPercentageChange] = useState(null);

  // Live price data from Redux
  const liveData = useSelector((state) => state.stocks[symbol] || []);

  // Fetch security snapshot from Supabase
  useEffect(() => {
    async function fetchSnapshot() {
      const data = await getSecuritySnapshot(symbol);
      if (data) {
        setSnapshot(data);
      }
    }
    fetchSnapshot();
  }, [symbol]); // Runs only when symbol changes

  // Get last live price from Redux every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!liveData.length) return;

      const latestPrice = liveData[liveData.length - 1].price; // Get last live price
      setLastLivePrice(latestPrice);

      if (snapshot?.last_close) {
        const change = ((latestPrice - snapshot.last_close) / snapshot.last_close) * 100;
        setPercentageChange(change);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [liveData, snapshot]); // Depend on live data and snapshot

  // Determine text color based on price change
  const changeClass = percentageChange >= 0 ? styles.positive : styles.negative;

  return (
    <div className={styles.snapshot}>
      {/* Show logo if enabled */}
      {icon && (
        <Image
          src={`/symbol_icons/${symbol.toUpperCase()}.svg`}
          alt={`${symbol} logo`}
          width={32}
          height={32}
          className={styles.icon}
        />
      )}

      {/* Display Stock Symbol */}
      <div className={styles.symbol}>{symbol.toUpperCase()}</div>

      {/* Display Last Live Price or Placeholder */}
      <div className={styles.price}>
        {lastLivePrice !== null ? `$${lastLivePrice.toFixed(2)}` : "Loading..."}
      </div>

      {/* Display Percentage Change */}
      <div className={`${styles.change} ${changeClass}`}>
        {percentageChange !== null ? `${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(2)}%` : "—"}
      </div>

      {/* Show Currency if Available */}
      {snapshot?.currency && <div className={styles.currency}>{snapshot.currency}</div>}
    </div>
  );
};

export default SymbolSnapshot;