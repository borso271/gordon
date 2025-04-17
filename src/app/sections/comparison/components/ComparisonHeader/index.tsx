import React from "react";
import styles from "./ComparisonHeader.module.css";
import SnapshotCell from "../../../../../components/SnapshotCell";
import TradeButton from "../../../../../components/Buttons/TradeButton";
import SymbolTitle from "../../../../(pages)/(dashboard)/components/Watchlist/SymbolTitle";

import { useTranslation } from "react-i18next";

interface SnapshotData {

  Ticker: string;
  currentPrice: number;
  low: number;
  high: number;
  open: number;
  volume: number;
  prevClose: number;
}

interface SnapshotWrapper {
  ticker: string;
  symbol_id?: number;
  asset_type?: "stock" | "crypto" | "etf";
  name? : string;
  snapshot: SnapshotData;
}

interface ComparisonHeaderProps {
  snapshots: SnapshotWrapper[];
}

const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({ snapshots }) => {

  const { t } = useTranslation();
  if (snapshots.length !== 2) return null;

  const [left, right] = snapshots;
  const currencySymbol = "$";



  const getChangePct = (snap: SnapshotData) => {
    const change = snap.currentPrice - snap.prevClose;
    const changePct = (change / snap.prevClose) * 100;
    return changePct;
  };
  
  return (
    <div className={styles.wrapper}>
      {/* Current Price (Ticker as label) */}
      <div className={styles.borderedContainer}>
        <div className={styles.firstRow}>
          <div className={styles.cell}>
            <SymbolTitle ticker={left.snapshot.Ticker} name={"Apple"} iconSize={42}/>
          </div>
          <div className={styles.cell}>
            <SymbolTitle ticker={right.snapshot.Ticker} name={"Apple"} iconSize={42} />
          </div>
        </div>
      </div>
  
      {/* Price */}
      <div className={styles.borderedContainer}>
  <div className={styles.row}>
    <SnapshotCell
      label={t("snapshot.price")}
      value={left.snapshot.currentPrice}
      currencySymbol={currencySymbol}
      applyColor={false}
      isPercentage={false}
    />
    <SnapshotCell
      label={t("snapshot.price")}
      value={right.snapshot.currentPrice}
      currencySymbol={currencySymbol}
      applyColor={false}
      isPercentage={false}
    />
  </div>
</div>

<div className={styles.borderedContainer}>
  <div className={styles.row}>
    <SnapshotCell
      label={t("snapshot.change")}
      value={getChangePct(left.snapshot)}
      withCurrency={false}
      type="type2"
      applyColor={true}
    />
    <SnapshotCell
      label={t("snapshot.change")}
      value={getChangePct(right.snapshot)}
      withCurrency={false}
      type="type2"
      applyColor={true}
    />
  </div>

  <div className={styles.row}>
    <SnapshotCell
      label={t("snapshot.volume")}
      value={left.snapshot.volume}
      withCurrency={false}
      applyColor={false}
      isPercentage={false}
    />
    <SnapshotCell
      label={t("snapshot.volume")}
      value={right.snapshot.volume}
      withCurrency={false}
      applyColor={false}
      isPercentage={false}
    />
  </div>

  <div className={styles.row}>
    <SnapshotCell
      label={t("snapshot.prev_close")}
      value={left.snapshot.prevClose}
      currencySymbol={currencySymbol}
      applyColor={false}
      isPercentage={false}
    />
    <SnapshotCell
      label={t("snapshot.prev_close")}
      value={right.snapshot.prevClose}
      currencySymbol={currencySymbol}
      applyColor={false}
      isPercentage={false}
    />
  </div>
</div>

      {/* <div className={styles.borderedContainer}>
        <div className={styles.row}>
          <SnapshotCell
            label="Price"
            value={left.snapshot.currentPrice}
            currencySymbol={currencySymbol}
            applyColor={false}
            isPercentage={false}
          />
          <SnapshotCell
            label="Price"
            value={right.snapshot.currentPrice}
            currencySymbol={currencySymbol}
            applyColor={false}
            isPercentage={false}
          />
        </div>
      </div>
  
   
      <div className={styles.borderedContainer}>
        <div className={styles.row}>
          <SnapshotCell
            label="Change"
            value={getChangePct(left.snapshot)}
            withCurrency={false}
            type="type2"
            applyColor={true}
          />
          <SnapshotCell
            label="Change"
            value={getChangePct(right.snapshot)}
            withCurrency={false}
            type="type2"
            applyColor={true}
          />
        </div>
  
      
        <div className={styles.row}>
          <SnapshotCell
            label="Volume"
            value={left.snapshot.volume}
            withCurrency={false}
            applyColor={false}
            isPercentage={false}
          />
          <SnapshotCell
            label="Volume"
            value={right.snapshot.volume}
            withCurrency={false}
            applyColor={false}
            isPercentage={false}
          />
        </div>
  
     
        <div className={styles.row}>
          <SnapshotCell
            label="Prev Close"
            value={left.snapshot.prevClose}
            currencySymbol={currencySymbol}
            applyColor={false}
            isPercentage={false}
          />
          <SnapshotCell
            label="Prev Close"
            value={right.snapshot.prevClose}
            currencySymbol={currencySymbol}
            applyColor={false}
            isPercentage={false}
          />
        </div>
      </div> */}
  
      {/* Trade Buttons */}
      <div className={styles.tradeRow}>
     
        <div className={styles.cell}>
        <TradeButton  width={140} ticker={{
                      symbol_id: left.symbol_id,
                      ticker: left.ticker,
                      name: left.name,
                      asset_type: left.asset_type,
                   
                  }} />
        </div>
        <div className={styles.cell}>
          <TradeButton  width={140} ticker={{
                      symbol_id: right.symbol_id,
                      ticker: right.ticker,
                      name: right.name,
                      asset_type: right.asset_type,
                   
                  }} />
        </div>
      </div>
    </div>
  );
}
  

export default ComparisonHeader;

