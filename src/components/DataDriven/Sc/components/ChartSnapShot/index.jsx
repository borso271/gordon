import { useEffect, useState } from "react";
import Icon from "../../../../Icons/Icon/index.tsx";
import styles from "./ChartSnapshot.module.css"; // Assuming styles are here
import SymbolIcon from "../../../../Icons/SymbolIcon";

const ChartSnapshot = ({ symbol,name, latestPrice, lastClose, currency, asset_type, icon = false }) => {
  // 4 elements

  const [percentageChange, setPercentageChange] = useState(null);

  // Update percentage change whenever latestPrice or snapshot changes
  useEffect(() => {
    if (latestPrice !== null && lastClose) {
      const change = ((latestPrice - lastClose) / lastClose) * 100;
      setPercentageChange(change);
    }
  }, [latestPrice, lastClose]); // Depend on latestPrice and snapshot

  // Determine text color based on price change
  const changeClass = percentageChange >= 0 ? styles.positive : styles.negative;

  const trendIcon = percentageChange >= 0 ? "positive_trend" : "negative_trend";
    

  const [iconSize, setIconSize] = useState(window.innerWidth < 768 ? 46 : 60);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 768 ? 46 : 60);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className={styles.snapshot}>
      {/* Show logo if enabled */}
      
      <div className={styles.iconWrapper}>
<SymbolIcon asset_type={asset_type} ticker_symbol={symbol} size={iconSize}  />
    </div>

<div className={styles.metadata}>
      {/* Display Stock Symbol */}
      <div className={styles.symbol}>{name} • {symbol.toUpperCase()} </div>

      {/* <div className={styles.price}>
        {latestPrice !== null ? `Updated: ${lastUpdated}` : ""}
      </div> */}

      {/* Display Last Live Price or Placeholder */}
      <div className={styles.priceData}>
      <div className={styles.price}>
        {latestPrice !== null ? `${currency} ${latestPrice.toFixed(2)}` : "Loading..."}
      </div>

      {/* Display Percentage Change */}
      <div className={`${styles.change} ${changeClass}`}>
      <Icon name={trendIcon} size={12} />
    
        {percentageChange !== null ? `${percentageChange.toFixed(2)}%` : "—"}
      </div>
      {/* Show Currency if Available */}
      {/* {currency && <div className={styles.currency}>{currency}</div>} */}
      </div>
    </div>

    </div>
  );
};

export default ChartSnapshot;
