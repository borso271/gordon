import React from "react";
import styles from "./RatingsAndNews.module.css";
import AnalystRatings from "../data_driven/Ratings";
import TickerNews from "../Data_driven/News";

const RatingsAndNews = ({symbol }) => {
  return (
    <div className={styles.container}>
      <AnalystRatings ticker_symbol={symbol} />
      <TickerNews ticker_symbol={symbol} />
    </div>
  );
};

export default RatingsAndNews;
