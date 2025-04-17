import React from "react";
import styles from "./AssetWithInsight.module.css";
import TradeButton from "../../Buttons/TradeButton";
import SymbolTitle from "../../../app/(pages)/(dashboard)/components/Watchlist/SymbolTitle";
import ValueTrend from "../../ValueTrend";
import { SimpleTicker } from "../../../interfaces";


import { useTranslation } from "react-i18next";

// Inside the component:


type AssetWithInsightProps = {
  item: {
    id: number;
    ticker: string;
    name?: string;
    asset_type?: "stock"|"crypto"|"etf";
    insight?: string;
    polygon_snapshot?: {
      current_price: number;
      last_close: number;
      day_high?: number;
      day_low?: number;
      updated?: number;
    };
  };
};


function extractSimpleTicker(assetWithInsight: AssetWithInsightProps): SimpleTicker {
  const { item } = assetWithInsight;

  return {
    symbol_id: item.id,
    ticker: item.ticker,
    name: item.name ?? "",
    asset_type: item.asset_type ?? "stock",
    polygon_snapshot: item.polygon_snapshot ?? null
  };
}

const AssetWithInsight: React.FC<AssetWithInsightProps> = ({ item }) => {
  const { id, asset_type, ticker, name, insight, polygon_snapshot } = item;
  const { t } = useTranslation();
  const current = polygon_snapshot?.current_price ?? null;
  const previous = polygon_snapshot?.last_close ?? null;

  const changePercent =
    current !== null && previous !== null
      ? (((current - previous) / previous) * 100)
      : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.nameWrapper}>
        <SymbolTitle ticker={ticker} asset_type={asset_type} name={name} />
        </div>
        <div>   {current !== null && changePercent !== null && (
    <div className={styles.priceBox}>

            <ValueTrend value={current} variant={"medium"} applyColor={false} isPercentage={false} currencySymbol={"$"}/>
            <ValueTrend value={changePercent} variant={"small"} />

        </div>
      )}
      </div>
      <div className={styles.tradeButtonWrapper}>
      <TradeButton ticker={extractSimpleTicker({item})}   />
        </div>
      </div>
      {insight && <div className={styles.insight}><span className={styles.insightSpan}>{t("asset.insightLabel")}</span>{insight}</div>}
    </div>
  );
};

export default AssetWithInsight;

