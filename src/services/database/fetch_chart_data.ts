// Import necessary functions
import fetchIntradayData from "./fetch_intraday_data";
import fetchAllHistoricalData from "./fetch_historical_data";
import formatIntradayData from "../utils/format_intraday_data";
import formatHistoricalData from "../utils/format_historical_data";


export async function getChartData(symbol, symbol_id, isMarketOpen): Promise<Map<any, any>> {
  //console.log("GET CHART DATA CALLED, INPUTS ARE: ", symbol, symbol_id, isMarketOpen);

  try {
    const [intradayResponse, historicalResponse] = await Promise.all([
      fetchIntradayData(symbol, symbol_id, isMarketOpen),
      fetchAllHistoricalData(symbol, symbol_id),
    ]);

    const intraday = formatIntradayData(intradayResponse);
    const oneD = formatHistoricalData(historicalResponse.day_prices);
    const oneW = formatHistoricalData(historicalResponse.week_prices);
    const oneM = formatHistoricalData(historicalResponse.month_prices);
    const oneY = formatHistoricalData(historicalResponse.year_prices);
    const fiveY = formatHistoricalData(historicalResponse.all_time_prices);

    return new Map([
      ["ID", intraday],
      ["1D", oneD],
      ["1W", oneW],
      ["1M", oneM],
      ["1Y", oneY],
      ["5Y", fiveY],
    ]);
  } catch (err) {
    console.error("Error fetching chart data:", err);
    return new Map(); // ✅ always return a Map
  }
}
