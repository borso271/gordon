import React from "react";
import styles from "./PChart.module.css";
import TerziaryH2 from "../../../../../components/Headings/TerziaryH2";
import PortfolioChart from "../../../../../components/DataDriven/PortfolioChart";
import MagicButton from "../../../../../components/Buttons/MagicButton";
import { useTranslation } from 'react-i18next';

import { useManualActionRequests } from "../../../../hooks/useManualActionRequests";
// add the onclick here to the magic button

const Pchart: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {handleOuterSummarize} = useManualActionRequests()

  return (
    <div className={styles.container}>
      <div className={styles.pchartHeader}>
        <TerziaryH2>{t('portfolio_performance.title')}</TerziaryH2>
        <MagicButton
          text={t('portfolio_performance.summarize')}
          onClick={() => handleOuterSummarize()}
        />
      </div>

      {/* pass current UI language to the chart if it supports i18n */}
      <PortfolioChart symbol="AAPL" language={i18n.language} />
    </div>
  );
};

export default Pchart;
