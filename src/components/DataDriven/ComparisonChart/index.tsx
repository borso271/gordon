import {useRef} from 'react';
import styles from "./ComparisonChart.module.css";
import PeriodSelector from "./components/PeriodSelector";
import ChartCanvas from "./components/ChartCanvas";
import PriceLegend from "./components/PriceLegend";

import PrimaryDivider from "../../Layout/PrimaryDivider";
import ChartLoader from "../../Loaders/ChartLoader";
import { useChartSizeObserver } from '../../../app/hooks/useChartSizeObserver';
import { useComparisonChart } from '../../../app/hooks/useComparisonChart';


import { useTranslation } from "react-i18next";

// Inside the component:

const CustomComparisonChart = ({ symbols,language }: { symbols: string[], language: string}) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartSizeObserver(containerRef);
  const { t } = useTranslation();
  const {
    chartDataMap,
    selectedPeriod,
    setSelectedPeriod,
    isMarketOpen,
    priceLegendSegments,
    timeLegendPercentage,
    adjustedLow,
  } = useComparisonChart(symbols, width, height);

  if ( !chartDataMap ) {
    return <ChartLoader />;
  }

  const timeLegendWidth = timeLegendPercentage + "%";

  return (
   
      <div className={styles.container}>
       
       <div className={styles.chartTitle}>
       {t("price_chart")}</div>

        <PrimaryDivider />

        <div className={styles.chartMain}>
        

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
              
              {/* pass to chart canvas two period data, or a list thereof, even better... */}

              <ChartCanvas
              
                dataMap={chartDataMap}
                minPrice={adjustedLow}
                marketOpen={isMarketOpen}
                language={language}

              />
              
            </div>
            {/* <div></div>
            <TimeLegend width={width} timeRanges={timeRanges}/> */}
          </div>
        </div>
        <div className={styles.chartOverview}>
         
         <PeriodSelector
         selectedPeriod={selectedPeriod}
         setSelectedPeriod={setSelectedPeriod}
         />
       </div>
      </div>
    
  );
};

export default CustomComparisonChart;
