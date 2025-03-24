import React from "react";
import styles from "./RatingsAndNews.module.css";
import AnalystRatings from "../DataDriven/Ratings";
import TickerNews from "../DataDriven/News";

interface RatingsAndNewsProps {
  symbol: string;
}

const RatingsAndNews: React.FC<RatingsAndNewsProps> = ({ symbol }) => {
  return (
    <div className={styles.container}>
      <AnalystRatings ticker_symbol={symbol} />
      <TickerNews ticker_symbol={symbol} />
    </div>
  );
};

export default RatingsAndNews;
