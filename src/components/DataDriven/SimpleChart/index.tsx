import {useRef} from 'react';
import styles from "./SymbolChart.module.css";

import ChartCanvas from "./components/ChartCanvas";

import PriceLegend from "./components/PriceLegend";

import ChartLoader from "../../Loaders/ChartLoader";

import { useChartSizeObserver } from '../../../app/hooks/useChartSizeObserver';
import { useSimpleChart } from '../../../app/hooks/useSimpleChart';


import { useTranslation } from 'react-i18next';

const SimpleChart = ({ data,language }: { data: any,  language: string}) => {

  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartSizeObserver(containerRef);

  console.log("width and height are: ", width, height);

  const {
    finalPeriodData,
    priceLegendSegments,
    adjustedLow,
    isPositiveChange,
    currentPrice
   
  } = useSimpleChart(data, width, height);
   

  // Same fallback logic to show loader
  if (!currentPrice || !data ) {
    return <ChartLoader />;
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{t("portfolio_performance.title")}</h3>
      <div className={styles.container}>
       
        {/* <PrimaryDivider /> */}

        <div className={styles.chartMain}>
        
          <div 
           className={`${styles.chartGrid} chartGrid`}>
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
           
                language={language}
                height={height}
              />

            </div>
            <div></div>
            {/* <TimeLegend width={width} timeRanges={timeRanges}/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChart;
