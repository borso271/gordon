import React from "react";
import styles from "./RatingsAndNews.module.css";
// import AnalystRatings from "../DataDriven/Ratings";
import TickerNews from "../DataDriven/News";

interface RatingsAndNewsProps {
  symbol: string;
  language: string;
}

const RatingsAndNews: React.FC<RatingsAndNewsProps> = ({ symbol, language }) => {
  return (
    <div className={styles.container}>
      {/* <AnalystRatings ticker_symbol={symbol} language={language} /> */}
      <TickerNews ticker_symbol={symbol} language={language} />
    </div>
  );
};

export default RatingsAndNews;
