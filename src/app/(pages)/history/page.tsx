"use client"

import React from 'react';
import styles from './page.module.css'
import TransactionHistory from './components/TransactionHistory';
import LayoutWithNavbar from '../../../components/Layout/MainLayout';
import { useMemo } from "react";
import { useTranslation } from "react-i18next";


const HistoryPage = () => {
  const { t } = useTranslation();

  const suggestions = useMemo(
    () => [
      {
        label: t("suggestions.portfolio_review"),
        prompt: "review my portfolio performance",
      },
      {
        label: t("suggestions.rebalance_portfolio"),
        prompt: "how should I rebalance my portfolio?",
      },
      {
        label: t("suggestions.diversify_portfolio"),
        prompt: "how do I diversify my investments?",
      },
      {
        label: t("suggestions.evaluate_stock"),
        prompt: "is Apple still a good investment?",
      },
      {
        label: t("suggestions.asset_allocation"),
        prompt: "what's the ideal asset allocation?",
      },
    ],
    [t]
  );

  return (
    <div className={styles.container}>
      <LayoutWithNavbar suggestions={suggestions}>
        <TransactionHistory />
      </LayoutWithNavbar>
    </div>
  );
};

export default HistoryPage;
