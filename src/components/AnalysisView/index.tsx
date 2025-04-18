import React from "react";

import AnalystRatings from "../DataDriven/Ratings";
import DetachedChart from "../DataDriven/DetachedChart";
import PolygonSnapshot from "../PolygonSnapshot";
import NewsToggleList from "../NewNews/NewsToggleList";
import styles from './AnalysisView.module.css'
interface AnalysisViewProps {
  data: any;
}
const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  
 const ratings = data.ratings || null;
 const ticker_symbol = data.ticker_symbol;
 const polygon_data = data.polygon_snapshot;
 const isPolygonDataOk = typeof polygon_data.currentPrice === 'number' && polygon_data.currentPrice > 0;

 console.log("polygon data here is: ", polygon_data, polygon_data.currentPrice);

const news=data.latest_news;
  return (
<div className={styles.container}>
 <DetachedChart symbol={ticker_symbol} language={"en"}/>

 {isPolygonDataOk && <PolygonSnapshot data={polygon_data} />}
 {ratings?.status === "success" && <AnalystRatings ratings={ratings.ratings} />}

{news &&  <NewsToggleList news={news} titleKey={"latest_news"}/>}
   
    </div>
  );
};

export default AnalysisView;
