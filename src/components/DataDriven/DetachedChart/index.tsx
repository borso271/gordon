
import {useRef} from 'react'
import { useChartSizeObserver } from '../../../app/hooks/useChartSizeObserver';
import styles from "./SymbolChart.module.css";
import PeriodSelector from "./components/PeriodSelector";
import ChartCanvas from "./components/ChartCanvas";
import ChartSnapshot from "./components/ChartSnapShot";
import PriceLegend from "./components/PriceLegend";
import PriceChangeOverview from "./components/PriceChangeOverview";
import PriceMiniOverview from "./components/PriceMiniOverview";
import PrimaryDivider from "../../Layout/PrimaryDivider";
import ChartLoader from "../../Loaders/ChartLoader";
import { useSymbolChart } from "../../../app/hooks/useSymbolChart";
import { arabicMonthMap } from "../../../interfaces";

const DetachedChart = ({ symbol,language }: { symbol: string, language: string}) => {
  // ✅ Destructure all values from the hook

  // just get the data here as prop rather than fetchig it...
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartSizeObserver(containerRef);

   

  const {
    // chartRef,
    // chartDimensions,

    selectedPeriod,
    setSelectedPeriod,
    periodData,
    isMarketOpen,
    currentPrice,
    snapShot,
    symbol_name,
    asset_type,
    lastUpdated,
    isPositiveChange,
    finalPeriodData,
    priceLegendSegments,
    timeLegendPercentage,
    lastPrices,
    adjustedLow,
  } = useSymbolChart(symbol,width, height);
 
  if (!currentPrice || !periodData) {
    return <ChartLoader />;
  }

  // Now just render
  const timeLegendWidth = timeLegendPercentage + "%";

  return (
    <div className={styles.chartContainer}>
      <div className={styles.container}>
        <div className={styles.chartTop}>
          <ChartSnapshot
            symbol={symbol}
            asset_type={asset_type}
            name={symbol_name}
            latestPrice={currentPrice}
            lastClose={snapShot.last_close}
            currency={snapShot.currency}
            language={language}
          />

          <div className={styles.topRight}>
            {/* <h4 className={styles.lastUpdated}>{asOf}{localLastUpdated}</h4> */}
            <PriceChangeOverview
            current_price={currentPrice}
            changes={lastPrices}
            language={language}
            />
          </div>
        </div>

        <div className={styles.chartMain}>
          <div className={styles.chartOverview}>
            <PriceMiniOverview
            current_price={currentPrice}
            changes={lastPrices}
            period={selectedPeriod}
            language={language}
            />
           
          </div>

          <div
            className={styles.chartGrid}
            style={{
              "--time-legend-width": timeLegendWidth,
            } as React.CSSProperties}
          >
            <PriceLegend
              height={height}
              metadata={priceLegendSegments}
              yoffset={0}
            />
            <div ref={containerRef} className={styles.chartWrapper}>
              <ChartCanvas
                data={finalPeriodData}
                minPrice={adjustedLow}
                isPositiveChange={isPositiveChange}
                marketOpen={isMarketOpen}
                language={language}
               
              />
            </div>
           
          </div>
          <div className={styles.periodSelectorWrapper}>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            language={language} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetachedChart;
