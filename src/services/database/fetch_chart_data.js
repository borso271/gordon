// Import necessary functions
import fetchIntradayData from "./fetch_intraday_data";
import fetchAllHistoricalData from "./fetch_historical_data";
import formatIntradayData from "../utils/format_intraday_data";
import formatHistoricalData from "../utils/format_historical_data";

export async function getChartData(symbol, symbol_id, exchange_mic, asset_type, isMarketOpen, lastUpdateTimeRef, setSeriesesData) {
  try {
  
    const [intradayResponse, historicalResponse] = await Promise.all([
      fetchIntradayData(symbol, symbol_id,isMarketOpen),
      fetchAllHistoricalData(symbol, symbol_id),
    ]);

    console.log('INTRADAY RESPONSE IS: ', intradayResponse)
    // Format the data
    const intraday = formatIntradayData(intradayResponse);
    const oneD = formatHistoricalData(historicalResponse.day_prices);
    const oneW = formatHistoricalData(historicalResponse.week_prices);
    const oneM = formatHistoricalData(historicalResponse.month_prices);
    const oneY = formatHistoricalData(historicalResponse.year_prices);
    const fiveY = formatHistoricalData(historicalResponse.all_time_prices);

    // Build a new map with all the periods
    const newMap = new Map([
      ["ID", intraday],
      ["1D", oneD],
      ["1W", oneW],
      ["1M", oneM],
      ["1Y", oneY],
      ["5Y", fiveY],
    ]);

    // Update the state in one go
    setSeriesesData(newMap);

    // Record the last known intraday time
    if (oneD.length > 0) {
      lastUpdateTimeRef.current = oneD[oneD.length - 1].time;
    }
  } catch (err) {
    console.error("Error fetching chart data:", err);
  }
}

export default getChartData