"use client"
import React from 'react';
import styles from './page.module.css'
import PortfolioPage from './components/Dashboard';
import LayoutWithNavbar from '../../../components/Layout/MainLayout';


import { memo, useMemo } from 'react';


const DashboardPage = () => {
  const suggestions = useMemo(
    () => [
      { label: "Top Gainers and Losers", prompt: "show top gainers" },
      { label: "What Makes a Good Investment?", prompt: "show top losers" },
      { label: "What Are the Latest News on the Market?", prompt: "suggest tech" },
      { label: "Upcoming IPOs in Saudi Arabia", prompt: "show undervalued" },
      { label: "What is a Bullish Market?", prompt: "show bullish" },
    ],
    [] // empty deps = memoized forever (until unmount)
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

