import React from "react";
import styles from "./PriceMiniOverview.module.css";
import SecondaryH2 from "../../../../Headings/SecondaryH2"
const PriceMiniOverview = ({ current_price, changes, period }) => {
    // Find the change corresponding to the selected period

    let longPeriod = "Last Day";
    if (period =="1W"){
      longPeriod = "Last Week"
    }

    else if (period =="1M"){
      longPeriod = "Last Month"
    }

    if (period =="1Y"){
      longPeriod = "Last Year"
    }

    if (period =="5Y"){
      longPeriod = "Last Five Years"
    }


    const selectedChange = changes.find(change => change.period === period);
  
    const percentageChange = ((current_price - selectedChange?.last_price) / selectedChange?.last_price) * 100;
    const isPositive = percentageChange >= 0;
    const changeColor = isPositive ? styles.positive : styles.negative;
    const sign = isPositive ? "+" : "-";
    
    return (
      <div className={styles.container}>
        <SecondaryH2>Price Chart</SecondaryH2>
        
        <div className={styles.container}>
          {selectedChange ? (
            <div className={styles.item}>
              <span className={`${styles.change} ${changeColor}`}>
                {sign}{Math.abs(percentageChange.toFixed(2))}%
              </span>
              <span className={styles.period}>{longPeriod}</span>
            </div>
          ) : (
            <p className={styles.noData}>No data available for this period</p>
          )}
        </div>
      </div>
    );
};    
  
  export default PriceMiniOverview;
  