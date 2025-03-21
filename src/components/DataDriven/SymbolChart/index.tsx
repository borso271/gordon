
import styles from "./SymbolChart.module.css";
import PeriodSelector from "./components/PeriodSelector/index.jsx";
import ChartCanvas from "./components/ChartCanvas";
import ChartSnapshot from "./components/ChartSnapShot/index.jsx";
import PriceLegend from "./components/PriceLegend/index.jsx";
import PriceChangeOverview from "./components/PriceChangeOverview/index.jsx";
import PriceMiniOverview from "./components/PriceMiniOverview";
import PrimaryDivider from "../../Layout/PrimaryDivider/index.jsx";
import ChartLoader from "../../Loaders/ChartLoader";
import { useSymbolChart } from "../../../app/hooks/useSymbolChart";

const SymbolChart = ({ symbol }: { symbol: string }) => {
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
          />

          <div className={styles.topRight}>
            <h4 className={styles.lastUpdated}>As of {lastUpdated}</h4>
            <PriceChangeOverview current_price={currentPrice} changes={lastPrices} />
          </div>
        </div>

        <PrimaryDivider />

        <div className={styles.chartMain}>
          <div className={styles.chartOverview}>
            <PriceMiniOverview current_price={currentPrice} changes={lastPrices} period={selectedPeriod} />
            <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolChart;
