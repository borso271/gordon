import React from "react";
import styles from "./Watchlist.module.css";

import TerziaryH2 from "../../../../../components/Headings/TerziaryH2";

import WatchlistItem from "./WatchlistItem";
import PrimaryDivider from "../../../../../components/Layout/PrimaryDivider";
type Props = {
  watchlist: {
    id: number;
    name: string;
    ticker: string;
    asset_type: "stock" | "etf" | "crypto";
    last_price: number | null;
    last_close: number | null;
  }[];
};
import { useTranslation } from 'react-i18next';

const WatchlistDisplay: React.FC<Props> = ({ watchlist }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.watchlistHeader}>
        <TerziaryH2>{t('watchlist.title')}</TerziaryH2>
        <div className={styles.viewAll}>{t('watchlist.view_all')}</div>
      </div>
      <PrimaryDivider />
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            {watchlist.map((item) => (
              <WatchlistItem key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistDisplay;

