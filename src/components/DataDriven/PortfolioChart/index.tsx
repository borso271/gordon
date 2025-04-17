import {useRef} from 'react';
import styles from "./SymbolChart.module.css";
import PeriodSelector from "./components/PeriodSelector";
import ChartCanvas from "./components/ChartCanvas";
import ChartSnapshot from "./components/ChartSnapShot";
import PriceLegend from "./components/PriceLegend";
import PriceChangeOverview from "./components/PriceChangeOverview";
import PriceMiniOverview from "./components/PriceMiniOverview";
import PrimaryDivider from "../../Layout/PrimaryDivider";
import ChartLoader from "../../Loaders/ChartLoader";
import { usePortfolioChart } from '../../../app/hooks/usePortfolioChart';
import { arabicMonthMap } from "../../../interfaces";
import TimeLegend from "./components/TimeLegend";
import { useChartSizeObserver } from '../../../app/hooks/useChartSizeObserver';

const PortfolioChart = ({ symbol,language }: { symbol: string, language: string}) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartSizeObserver(containerRef);
  
  const {
    selectedPeriod,
    setSelectedPeriod,
    periodData,
    finalPeriodData,
    currentPrice,
    lastUpdated,
    isPositiveChange,
    priceLegendSegments,
    timeLegendPercentage,
    lastPrices,
    adjustedLow,
  } = usePortfolioChart(symbol, width, height);

  // console.log("LAST PRICES ARE: ", lastPrices);
   
  const timeRanges = [
    { index: 0, label: "00:00" },
    { index: 1, label: "01:00" },
    { index: 2, label: "02:00" },
    { index: 3, label: "03:00" },
    { index: 4, label: "04:00" },
  ];
  const asOf = language == "en" ? "As of " : "اعتبارًا من ";
  const localLastUpdated =
  language === "ar"
    ? (() => {
        const [engMonth, day] = lastUpdated.split(" ");
        const arabicMonth = arabicMonthMap[engMonth] || engMonth;
        return `${arabicMonth} ${day}`;
      })()
    : lastUpdated;

  // Same fallback logic to show loader
  if (!currentPrice || !periodData ) {
    return <ChartLoader />;
  }

  const timeLegendWidth = timeLegendPercentage + "%";

  return (
    <div className={styles.chartContainer}>
      <div className={styles.container}>
       
        <PrimaryDivider />

        <div className={styles.chartMain}>
          <div className={styles.chartOverview}>

            <PriceMiniOverview
            current_price={currentPrice}
            changes={lastPrices}
            period={selectedPeriod}
            language={language}
            />

            <PeriodSelector
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            language={language} />
          </div>

          <div 
            className={`${styles.chartGrid} chartGrid`}
            style={{
              "--time-legend-width": timeLegendWidth,
            } as React.CSSProperties}
          >
            <PriceLegend
              height={height}
              metadata={priceLegendSegments}
              yoffset={0}
            />
            <div ref={containerRef}   className={styles.chartWrapper}>
              
              <ChartCanvas
              data={finalPeriodData}
                minPrice={adjustedLow}
                isPositiveChange={isPositiveChange}
                marketOpen={true}
                language={language}
                width={width}
                height={height}
              />

            </div>
            <div></div>
            <TimeLegend width={width} timeRanges={timeRanges}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
