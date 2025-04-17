
// example use in a page of the portfolio table component
"use client"
import { useEffect,memo, useState } from "react";
import PortfolioTable from "../Portfolio";
import WatchlistDisplay from "../Watchlist";
import Pchart from "../PChart";
import styles from './Dashboard.module.css'
import { fake_portfolio } from "../../../../fake_data/portfolio";
import { fake_watchlist } from "../../../../fake_data/watchlist";

import { enrichPortfolioWithMetrics } from "../Portfolio/utils/enrich_portfolio";
 function PortfolioPage() {

  console.log("[PortfolioPage] render");

  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);



  useEffect(() => {
    console.log("[PortfolioPage] useEffect");
    setPortfolio(fake_portfolio);
    setWatchlist(fake_watchlist);
    
  }, []);
  

  return (
<div className={styles.container}>
<div className={styles.main}>
<div className={styles.chartAndWatchlist}>
  <div className={styles.chartWrapper}>
    <Pchart />
  </div>
  <div className={styles.watchlistWrapper}>
    <WatchlistDisplay watchlist={watchlist} />
  </div>
</div>
   <div className={styles.portfolioTable}>
   <PortfolioTable portfolio={enrichPortfolioWithMetrics(portfolio)} />
   </div>
    </div>
</div>
  );
}


export default memo(PortfolioPage);
