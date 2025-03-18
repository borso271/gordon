import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getSymbolSnapshot from "../../../services/get_components_data/get_symbol_snapshot.js";
import fetch_symbol_info from "../../../utils/fetch_symbol_info.js";
import styles from "./Snapshot.module.css";
import SymbolIcon from "../../Icons/SymbolIcon/index.jsx";
import fetchLatestPrice from "../../../services/get_components_data/fetch_latest_price.js";
import SnapshotLoader from "../../Loaders/SnapshotLoader";
function getTextBeforeHyphen(input) {
  return typeof input === "string" && input.includes("-") 
    ? input.split("-")[0].trim() 
    : input;
}


const SymbolSnapshot = ({ symbol, onClick,icon = true }) => {
  //// console.log("ONCLICK FUNCTION IS: ", onClick)

const tt = "Alphabet Inc - Class C";

  const [symbolInfo, setSymbolInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!symbol) return; // Avoid fetching with an empty symbol
      try {
        const info = await fetch_symbol_info(symbol);
        
        setSymbolInfo(info);
      } catch (error) {
        console.error("Error fetching symbol info:", error);
      }
    }
    fetchData();
  }, [symbol]); // Runs whenever `symbol` changes

  const symbol_id = symbolInfo?.id || null;
  const exchange_mic = symbolInfo?.exchange_mic || null;
  const asset_type = symbolInfo?.asset_type || null;
  const [snapshot, setSnapshot] = useState(null);
  const [lastLivePrice, setLastLivePrice] = useState(null); // Last price from Redux
  const [percentageChange, setPercentageChange] = useState(null);
  const hsymbol_name = symbolInfo?.name || null;
  const symbol_name = getTextBeforeHyphen(hsymbol_name)

  // Live price data from Redux
  const liveData = useSelector((state) => state.stocks[symbol] || []);

  // Fetch security snapshot from Supabase
  useEffect(() => {
    if (!symbol_id) return; // ✅ Prevent running with null symbol_id
  
    async function fetchSnapshot() {
      try {
        const data = await getSymbolSnapshot(symbol,asset_type,symbol_id);
        setSnapshot(data || { last_close: 0, currency: "-" });

  setLastLivePrice(data.last_close)
      } catch (error) {
        console.error("🚨 Error fetching snapshot:", error);
      }
    }
  
    fetchSnapshot();
  }, [symbol_id]); // ✅ Now runs when `symbol_id` updates
  

  // Get last live price from Redux every 5 seconds (and immediately on mount)

useEffect(() => {
  let isMounted = true; // ✅ Prevent state updates after unmount

  const updatePrice = async () => {
    let latestPrice;

    if (liveData.length > 0) {
      // ✅ Use live data if available
      latestPrice = liveData[liveData.length - 1]?.price;
    } else {
      // ✅ Fetch from fetchLatestPrice() if no live data
      const fallbackData = await fetchLatestPrice(symbol_id);
      if (fallbackData && isMounted) {
        latestPrice = fallbackData.value;
      }
    }

    if (isMounted && latestPrice) {
      setLastLivePrice(latestPrice);

      if (snapshot?.last_close) {
        const change = ((latestPrice - snapshot.last_close) / snapshot.last_close) * 100;
        setPercentageChange(change);
      }
    }
  };

  // ✅ Run immediately on mount
  updatePrice();

  // ✅ Then update every 5 seconds
  const interval = setInterval(updatePrice, 5000);

  return () => {
    isMounted = false;
    clearInterval(interval); // Cleanup on unmount
  };
}, [liveData, snapshot, symbol_id]); // Depend on liveData, snapshot, and symbol_id

  const changeClass = percentageChange >= 0 ? styles.positive : styles.negative;


  if (!snapshot) {
    return <SnapshotLoader />;
  }


  return (
    <div className={styles.snapshot} onClick={onClick}>
    {/* Column 1: Icon */}
    <div className={styles.iconWrapper}>
     
<SymbolIcon asset_type={asset_type} ticker_symbol={symbol} size={50} />
    </div>

    <div className={styles.symbolContainer}>
      <div className={styles.symbol}>{symbol.toUpperCase()}</div>
      <div className={styles.symbolName}>{symbol_name}</div>
    </div>
    <div className={styles.priceContainer}>
      <div className={styles.price}>
        {lastLivePrice !== null ? `$${lastLivePrice.toFixed(2)}` : "-"}
      </div>
      <div className={`${styles.change} ${changeClass}`}>
        {percentageChange !== null ? `${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(2)}%` : "—"}
      </div>
    </div>
  </div>
);
};

export default SymbolSnapshot;




