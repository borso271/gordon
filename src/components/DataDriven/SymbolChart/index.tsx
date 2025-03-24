
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
const SymbolChart = ({ symbol,language }: { symbol: string, language: string}) => {
  // ✅ Destructure all values from the hook
  const {
    chartRef,
    chartDimensions,
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
  } = useSymbolChart(symbol);
   


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
            <h4 className={styles.lastUpdated}>{asOf}{localLastUpdated}</h4>
            <PriceChangeOverview
            current_price={currentPrice}
            changes={lastPrices}
            language={language}
            />
          </div>
        </div>

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
            className={styles.chartGrid}
            style={{
              "--time-legend-width": timeLegendWidth,
            } as React.CSSProperties}
          >
            <PriceLegend
              height={chartDimensions.height}
              metadata={priceLegendSegments}
              yoffset={0}
            />
            <div ref={chartRef} className={styles.chartWrapper}>
              <ChartCanvas
                data={finalPeriodData}
                minPrice={adjustedLow}
                isPositiveChange={isPositiveChange}
                marketOpen={isMarketOpen}
                language={language}
               
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolChart;
