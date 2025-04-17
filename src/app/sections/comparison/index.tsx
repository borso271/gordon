import React, { useEffect } from "react";
import styles from './ComparisonSidebar.module.css'
import ComparisonHeader from "./components/ComparisonHeader";
import CustomComparisonChart from "../../../components/DataDriven/ComparisonChart";
import MetricComparison from "./components/MetricComparison";
import CompareRatings from "../../../components/DataDriven/ComparisonRatings";
import { useTranslation } from "react-i18next";




interface ComparisonSidebarProps {
  data: any;
}
const ComparisonSidebar: React.FC<ComparisonSidebarProps> = ({ data }) => {

    const { t } = useTranslation();
  useEffect(() => {
    console.log("🧾 Sidebar received data:", data);
  }, [data]);

  const tickers = data.comparison_chart_data;
  const headerText = `${tickers[0]} ${t("vs")} ${tickers[1]}`;
  const metricComparisonData = data.metric_comparison_data;
  const ratings = data.ratings;
  const snapshots = data.snapshots;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{headerText}</h3>
     <ComparisonHeader snapshots={snapshots}/>
     <CustomComparisonChart symbols={tickers} language={""}/>
     <MetricComparison rawData={metricComparisonData}/>
     <CompareRatings ratings={ratings}/>
    </div>
  );
};

export default ComparisonSidebar;


