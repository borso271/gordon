"use client";

import React from "react";
import styles from "./PolygonSnapshot.module.css";
import { useTranslation } from "react-i18next";
import SnapshotCell from "../SnapshotCell";


interface PolygonSnapshotProps {
  data: {
    Ticker: string;
    currentPrice: number | null;
    low: number | null;
    high: number | null;
    open: number | null;
    volume: number | null;
    prevClose: number | null;
  };
}


const PolygonSnapshot: React.FC<PolygonSnapshotProps> = ({ data }) => {
  const { t } = useTranslation();
  const currency = "$";

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <SnapshotCell
          label={t("ticker_snapshot.current_price")}
          value={data.currentPrice}
          currencySymbol={currency}
          isPercentage={false}
          applyColor={false}
        />
        <SnapshotCell
          label={t("ticker_snapshot.low")}
          value={data.low}
          currencySymbol={currency}
          isPercentage={false}
          applyColor={false}
        />
      </div>

      <div className={styles.row}>
        <SnapshotCell
          label={t("ticker_snapshot.high")}
          value={data.high}
          currencySymbol={currency}
          isPercentage={false}
          applyColor={false}
        />
        <SnapshotCell
          label={t("ticker_snapshot.open")}
          value={data.open}
          currencySymbol={currency}
          isPercentage={false}
          applyColor={false}
        />
      </div>

      <div className={styles.row}>
        <SnapshotCell
          label={t("ticker_snapshot.volume")}
          value={data.volume}
          withCurrency={false}
          isPercentage={false}
          applyColor={false}
        />
        <SnapshotCell
          label={t("ticker_snapshot.prev_close")}
          value={data.prevClose}
          currencySymbol={currency}
          isPercentage={false}
          applyColor={false}
        />
      </div>
    </div>
  );
};

export default PolygonSnapshot;
