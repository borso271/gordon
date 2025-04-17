// services/symbolOverview.ts

import fetch_symbol_info from "../database/fetch_symbol_info";
import getSymbolSnapshot from "../database/get_symbol_snapshot";
import { getChartData } from "../database/fetch_chart_data";

export type Snapshot = {
  last_close: number;
  currency: string;
};

export type PriceDataMap = Map<string, any>;

interface SymbolOverviewResult {
  symbolInfo: any;
  snapShot: Snapshot;
  seriesesData: PriceDataMap;
  isMarketOpen: boolean;
}

export async function getSymbolOverviewData(symbol: string): Promise<SymbolOverviewResult> {
  if (!symbol) {
    console.warn("No symbol provided to getSymbolOverviewData");
    return {
      symbolInfo: null,
      snapShot: { last_close: 0, currency: "-" },
      seriesesData: new Map(),
      isMarketOpen: false,
    };
  }

  let symbolInfo: any = null;
  try {
    symbolInfo = await fetch_symbol_info(symbol);
  } catch (err) {
    console.error("❌ Error fetching symbol info:", err);
  }

  const symbol_id = symbolInfo?.id ?? null;
  const exchange_mic = symbolInfo?.exchange_mic ?? null;
  const asset_type = symbolInfo?.asset_type ?? null;

  const snapShot =
    symbol_id && asset_type
      ? await getSymbolSnapshot(symbol, asset_type, symbol_id).catch((err) => {
          console.error("❌ Error fetching snapshot:", err);
          return { last_close: 0, currency: "-" };
        })
      : { last_close: 0, currency: "-" };

  let seriesesData: PriceDataMap = new Map();
  if (symbol_id && exchange_mic && asset_type) {
    try {
      console.log("📊 Fetching chart data for", symbol, symbol_id);
      seriesesData = await getChartData(
        symbol,
        symbol_id,
        false,
      );

    } catch (err) {
      console.error("❌ Error fetching chart data:", err);
    }
  } else {
    console.warn("⏭️ Skipping chart data - missing required identifiers");
  }

  return {
    symbolInfo,
    snapShot,
    seriesesData,
    isMarketOpen: false, // future: compute with market API
  };
}
