"use client"
import React from 'react';
import styles from './page.module.css'
import PortfolioPage from './components/Dashboard';
import LayoutWithNavbar from '../../../components/Layout/MainLayout';
import { useTranslation } from 'react-i18next';

import { memo, useMemo } from 'react';


const DashboardPage = () => {



    const { t } = useTranslation();
  
    /** keep prompts as raw commands – localise only the UI text */
    const suggestions = useMemo(
      () => [
        {
          label: t("suggestions.top_gainers_losers"),
          prompt: "show top gainers",
        },
        {
          label: t("suggestions.good_investment"),
          prompt: "show top losers",
        },
        {
          label: t("suggestions.latest_market_news"),
          prompt: "suggest tech",
        },
        {
          label: t("suggestions.upcoming_ipos_sa"),
          prompt: "What are Upcoming Ipos In Saudi",
        },
        {
          label: t("suggestions.bullish_market"),
          prompt: "What is a Bullish Market",
        },
      ],
      [t] // ⚠️ include `t` so list refreshes when language changes
    );


  return (
    <div className={styles.container}>    
      <LayoutWithNavbar suggestions={suggestions}>
        <PortfolioPage />
        </LayoutWithNavbar>
    </div>
  );
};

export default memo(DashboardPage);

