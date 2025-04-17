import { getTickerDataForTickersByIds } from "./fetch_ticker_data";
import { generate_ticker_insight } from "./generate_ticker_insight";
import { getOrUpdateSnapshot } from "../price_snapshot";
export type TickerInsightResult = {
    id: number;
    ticker: string;
    name?: string;
    asset_type?: ValidAssetType;
    insight?: string;
    polygon_snapshot?: any;
  };

type ValidAssetType = "stock" | "etf" | "crypto";
function isValidAssetType(value: any): value is ValidAssetType {
  return value === "stock" || value === "etf" || value === "crypto";
}

export async function fetchTickerDataWithInsightAndPolygon(tickerIds: number[]): Promise<TickerInsightResult[]> {
  if (tickerIds.length === 0) return [];

  const tickerDataArray = await getTickerDataForTickersByIds(tickerIds);

  const results = await Promise.all(
    tickerDataArray.map(async (data): Promise<TickerInsightResult> => {
      const { id, ticker, name, asset_type, sector, description, ...indicators } = data;

      let tickerDataPrompt = `Ticker: ${ticker}`;
      if (name) tickerDataPrompt += `\nName: ${name}`;
      if (asset_type) tickerDataPrompt += `\nAsset Type: ${asset_type}`;
      if (sector) tickerDataPrompt += `\nSector: ${sector}`;
      if (description) tickerDataPrompt += `\nDescription: ${description}`;
      for (const [key, value] of Object.entries(indicators)) {
        tickerDataPrompt += `\n${key}: ${value}`;
      }

      const [insight, polygon_snapshot] = await Promise.all([
        generate_ticker_insight({ ticker_data: tickerDataPrompt }),
        isValidAssetType(asset_type)
          ? getOrUpdateSnapshot({ symbol: ticker, asset_type, ticker_id:id})
          : Promise.resolve({ error: true, message: `Unsupported asset_type: ${asset_type}` }),
      ]);

      return {
        id,
        ticker,
        name,
        asset_type,
        insight,
        polygon_snapshot,
      };
    })
  );

  return results;
}

  

