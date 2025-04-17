import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { getChartData } from "../../services/database/fetch_chart_data";
import mergeIntradayData from "../../components/DataDriven/SymbolChart/utils/merge_intraday_data";
import getSymbolSnapshot from "../../services/database/get_symbol_snapshot.js";
import fetch_symbol_info from "../../services/database/fetch_symbol_info.js";
import formatTimestamp from "../../components/DataDriven/SymbolChart/utils/format_timestsamp";
import returnPriceLegendSegments from "../../components/DataDriven/SymbolChart/utils/compute_price_legend/return_price_legend_metadata";
import { assign_list_XYCoordinatesIndexSimple } from "../../components/DataDriven/SymbolChart/utils/compute_point_coordinates/compute_xy_index";
import computeLastPrices from "../../components/DataDriven/SymbolChart/utils/compute_last_prices";
import { computeHistoricalPercentage} from "../../components/DataDriven/SymbolChart/utils/compute_historical_percentage";

// Same logic, just moved into a hook:

import { PricePoint, IntradayMap, LastPriceResult, PriceDataMap} from "../../interfaces/index.js";


// Get a reference point for 'now' (e.g., roughly June 11, 2024 midday GMT)
// Using a fixed value makes the example consistent. Replace with Date.now() for dynamic time.
const now = 1718107200000; // Example timestamp

// Helper to create intervals (milliseconds)
// 
export type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "ID";
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY; // Approximation
const YEAR = 365 * DAY; // Approximation

// Create the Map
const periodDataMap = new Map();

// --- 1D Data (e.g., last 24 hours, ~4hr intervals) ---
periodDataMap.set("1D", [
  { price: 151.22, time: now - 5 * HOUR * 4 }, // ~20 hours ago
  { price: 150.98, time: now - 4 * HOUR * 4 }, // ~16 hours ago
  { price: 151.15, time: now - 3 * HOUR * 4 }, // ~12 hours ago
  { price: 151.40, time: now - 2 * HOUR * 4 }, // ~8 hours ago
  { price: 151.35, time: now - 1 * HOUR * 4 }, // ~4 hours ago
  { price: 151.55, time: now },                // 'Now'
]);

// --- 1W Data (e.g., last 6 business days, daily intervals) ---
periodDataMap.set("1W", [
  { price: 147.50, time: now - 5 * DAY }, // ~5 days ago
  { price: 148.90, time: now - 4 * DAY }, // ~4 days ago
  { price: 148.20, time: now - 3 * DAY }, // ~3 days ago
  { price: 149.80, time: now - 2 * DAY }, // ~2 days ago
  { price: 149.50, time: now - 1 * DAY }, // ~1 day ago
  { price: 151.55, time: now },           // 'Now' (representing end of day/week)
]);

// --- 1M Data (e.g., last ~6 weeks, weekly intervals) ---
periodDataMap.set("1M", [
  { price: 144.00, time: now - 5 * WEEK }, // ~5 weeks ago
  { price: 145.20, time: now - 4 * WEEK }, // ~4 weeks ago
  { price: 147.80, time: now - 3 * WEEK }, // ~3 weeks ago
  { price: 146.50, time: now - 2 * WEEK }, // ~2 weeks ago
  { price: 149.50, time: now - 1 * WEEK }, // ~1 week ago
  { price: 151.55, time: now },            // 'Now'
]);

// --- 1Y Data (e.g., last year, ~2-month intervals) ---
periodDataMap.set("1Y", [
  { price: 125.00, time: now - 5 * MONTH * 2 }, // ~10 months ago
  { price: 130.00, time: now - 4 * MONTH * 2 }, // ~8 months ago
  { price: 135.50, time: now - 3 * MONTH * 2 }, // ~6 months ago
  { price: 140.00, time: now - 2 * MONTH * 2 }, // ~4 months ago
  { price: 145.00, time: now - 1 * MONTH * 2 }, // ~2 months ago
  { price: 151.55, time: now },                 // 'Now'
]);

// --- A (All Time) Data (e.g., last 6 years, yearly intervals) ---
periodDataMap.set("5Y", [
  { price: 45.00, time: now - 5 * YEAR }, // ~5 years ago
  { price: 60.00, time: now - 4 * YEAR }, // ~4 years ago
  { price: 80.00, time: now - 3 * YEAR }, // ~3 years ago
  { price: 100.00, time: now - 2 * YEAR },// ~2 years ago
  { price: 125.00, time: now - 1 * YEAR },// ~1 year ago
  { price: 151.55, time: now },           // 'Now'
]


);

periodDataMap.set("ID", [
   
  ]);

// --- You can now use periodDataMap ---
// Example: Get 1W data
// const weeklyData = periodDataMap.get("1W");
// console.log(weeklyData);

console.log("Generated periodDataMap:", periodDataMap);


export function usePortfolioChart(symbol: string, width: number, height: number) {

 const [snapShot, setSnapshot] = useState({ last_close: 0, currency: "-" });
//   const [symbolInfo, setSymbolInfo] = useState<any>(null);
//   useEffect(() => {
//     async function fetchData() {
//       if (!symbol) return;
//       try {
//         const info = await fetch_symbol_info(symbol);
//         setSymbolInfo(info);
//       } catch (error) {
//         console.error("Error fetching symbol info:", error);
//       }
//     }
//     fetchData();
//   }, [symbol]);
  
//   const symbol_id = symbolInfo?.id || null;
//   const exchange_mic = symbolInfo?.exchange_mic || null;
//   const asset_type = symbolInfo?.asset_type || null;
//   const symbol_name = symbolInfo?.name || null;

//   const [snapShot, setSnapshot] = useState({ last_close: 0, currency: "-" });
//   useEffect(() => {
//     if (!symbol_id) return; 
//     async function fetchSnapshot() {
//       try {
//         const data = await getSymbolSnapshot(symbol, asset_type, symbol_id);
//         setSnapshot(data || { last_close: 0, currency: "-" });
//       } catch (error) {
//         console.error("🚨 Error fetching snapshot:", error);
//       }
//     }
//     fetchSnapshot();
//   }, [symbol_id]);

//   // 3) Market open logic
//   const [isMarketOpen, setMarketOpen] = useState(false);
  
//   const checkMarketStatus = async () => {
//     try {
//       const response = await fetch("api/market_status", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           asset_type,     // e.g. "stock" or "crypto"
//           exchange_mic,   // e.g. "XNAS"
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Request failed with status ${response.status}`);
//       }
  
//       const data = await response.json();
//       const marketOpen: boolean = data.isOpen;
  
//       setMarketOpen(marketOpen);
//     } catch (error) {
//       console.error("❌ Error checking market status:", error);
//       setMarketOpen(false); // Fallback to false on error
//     }
//   };
  
//   useEffect(() => {
//     if (!asset_type || !exchange_mic) return;
//     // Check once
//     checkMarketStatus();
//     // Check every minute
//     const interval = setInterval(() => {
//       checkMarketStatus();
//     }, 60 * 1000);
//     return () => clearInterval(interval);
//   }, [asset_type, exchange_mic]);

//   // 4) Chart data logic

 const [seriesesData, setSeriesesData] = useState<PriceDataMap>(periodDataMap);

  const lastUpdateTimeRef = useRef<number>(0);

//   useEffect(() => {
//     if (!symbol_id || !exchange_mic || !asset_type) {
//       console.warn("⏭️ Skipping getChartData - Missing required values.");
//       return;
//     }
  
  // 5) Intraday data + live data merging logic
  const [intradayData, setIntradayData] = useState<any[]>([]);
  useEffect(() => {
   
    setIntradayData(seriesesData.get("ID") || []);
  }, [seriesesData]);

  const liveData = useSelector((state: any) => state.stocks[symbol] || []);
  
useEffect(() => {
    if (!liveData.length) return;
  
    const newPoints: PricePoint[] = liveData
      .map((entry) => ({
        time: entry.timestamp,
        price: entry.price,
      }))
      .filter((point) => point.time > lastUpdateTimeRef.current)
      .sort((a, b) => a.time - b.time);
  
    if (newPoints.length === 0) return;
  
    setSeriesesData((prevMap: IntradayMap) => {
      const updatedMap = mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef);
      setIntradayData(updatedMap.get("1D") || []);
      return updatedMap;
    });
  }, [liveData, seriesesData]);

  // 6) Period + computed values
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1D");

  const periodData: PricePoint[] = seriesesData.get(selectedPeriod) || [];
  const prices = periodData.map((d: any) => d.price);
  const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
  const dayMax = prices.length > 0 ? Math.max(...prices) : 0;

  const preferredPeriod: Period = "1D"; // ✅ not "ID"
  
  const fallbackPeriod: Period = "1D"; // ✅ not "ID"

  const mostRecentPeriodData = seriesesData.get(preferredPeriod)?.length
    ? seriesesData.get(preferredPeriod)
    : seriesesData.get(fallbackPeriod);
  const currentPrice = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].price
    : snapShot.last_close || 0;
  const lastUpdatedTimestamp = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].time
    : snapShot.last_close || 0;

  const lastUpdated = formatTimestamp(lastUpdatedTimestamp);

  const range = dayMax - dayMin;
  const padding = range * 0.15; 
  const adjustedHigh = dayMax + padding;
  const adjustedLow = Math.floor(dayMin - padding);




  const priceLegendSegments = useMemo(() => {
    return dayMin !== undefined && dayMax !== undefined
      ? returnPriceLegendSegments(adjustedLow, adjustedHigh)
      : [];
  }, [dayMin, dayMax]);


const dataPoints: PricePoint[] = seriesesData.get("ID") || [];
const timeLegendPercentage = computeHistoricalPercentage(dataPoints, selectedPeriod);

//   const timeLegendPercentage = computeHistoricalPercentage(seriesesData.get("ID") || [], selectedPeriod);

  const [relevant_close, setRelevantClose] = useState(0);
  useEffect(() => {
    if (periodData.length > 0) {
      setRelevantClose(periodData[0]?.price || 0);
    }
  }, [periodData, selectedPeriod]);

  const isPositiveChange = currentPrice > relevant_close;

  // 7) Combine final chart data
  const firstpartwidth = useMemo(() => {
    return (width * timeLegendPercentage) / 100 - 10;
  }, [width, timeLegendPercentage]);


//   console.log("series data in context is: ", seriesesData)
  
  const lastPrices: LastPriceResult[] = computeLastPrices(seriesesData);

  const offsetX = selectedPeriod === "1D" ? 0 : firstpartwidth;
  const intradaywidth = width - offsetX;

  const finalPeriodData = useMemo(() => {
    
    // 1) Compute periodData coords
    const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
      periodData,
      firstpartwidth,
      adjustedLow,
      adjustedHigh,
      height,
      0,       
      0       
    );

    // 2) Compute intraday coords
    const intradayData_With_Coos = assign_list_XYCoordinatesIndexSimple(
      intradayData,
      intradaywidth,
      adjustedLow,
      adjustedHigh,
      height,
      offsetX,
      0 
    );
  
    // 3) Merge the two
    return periodData_with_coos.concat(intradayData_With_Coos);
  
    // Add all relevant dependencies
  }, [
    periodData,
    intradayData,
    firstpartwidth,
    intradaywidth,
    adjustedLow,
    adjustedHigh,
    height,
    width,
    offsetX
  ]);

  // ✅ Return everything needed by SymbolChart's rendering
  return {
    selectedPeriod,
    setSelectedPeriod,
    periodData,
    currentPrice,
    snapShot,
    lastUpdated,
    isPositiveChange,
    finalPeriodData,
    priceLegendSegments,
    timeLegendPercentage,
    lastPrices,
    adjustedLow,
    adjustedHigh,
  };
}
