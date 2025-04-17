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

import { PricePoint, IntradayMap, LastPriceResult, PriceDataMap, Period} from "../../interfaces/index.js";

export function useSymbolChart(symbol: string, width: number, height: number) {

  const [symbolInfo, setSymbolInfo] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      if (!symbol) return;
      try {
        const info = await fetch_symbol_info(symbol);
        setSymbolInfo(info);
      } catch (error) {
        console.error("Error fetching symbol info:", error);
      }
    }
    fetchData();
  }, [symbol]);

  const symbol_id = symbolInfo?.id || null;
  const exchange_mic = symbolInfo?.exchange_mic || null;
  const asset_type = symbolInfo?.asset_type || null;
  const symbol_name = symbolInfo?.name || null;

  const [snapShot, setSnapshot] = useState({ last_close: 0, currency: "-" });
  useEffect(() => {
    if (!symbol_id) return; 
    async function fetchSnapshot() {
      try {
        const data = await getSymbolSnapshot(symbol, asset_type, symbol_id);
        setSnapshot(data || { last_close: 0, currency: "-" });
      } catch (error) {
        console.error("🚨 Error fetching snapshot:", error);
      }
    }
    fetchSnapshot();
  }, [symbol_id]);

  // 3) Market open logic
  const [isMarketOpen, setMarketOpen] = useState(false);
  
  // const checkMarketStatus = async () => {
  //   try {
  //     const response = await fetch("api/market_status", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         asset_type,     // e.g. "stock" or "crypto"
  //         exchange_mic,   // e.g. "XNAS"
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Request failed with status ${response.status}`);
  //     }
  
  //     const data = await response.json();
  //     const marketOpen: boolean = data.isOpen;
  
  //     setMarketOpen(marketOpen);
  //   } catch (error) {
  //     console.error("❌ Error checking market status:", error);
  //     setMarketOpen(false); // Fallback to false on error
  //   }
  // };
  
  // useEffect(() => {
  //   if (!asset_type || !exchange_mic) return;
  //   // Check once
  //   checkMarketStatus();
  //   // Check every minute
  //   const interval = setInterval(() => {
  //     checkMarketStatus();
  //   }, 60 * 1000);
  //   return () => clearInterval(interval);
  // }, [asset_type, exchange_mic]);

  // 4) Chart data logic

  const [seriesesData, setSeriesesData] = useState<PriceDataMap>(new Map());

  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!symbol_id || !exchange_mic || !asset_type) {
      console.warn("⏭️ Skipping getChartData - Missing required values.");
      return;
    }
  
    async function fetchChartData() {
      try {
        const chartData = await getChartData(symbol, symbol_id,isMarketOpen);
        setSeriesesData(chartData);
      } catch (err) {
        console.error("❌ Error fetching chart data:", err);
      }
    }
  
    fetchChartData();
  }, [symbol, symbol_id, exchange_mic, asset_type, isMarketOpen]);
  
  // 5) Intraday data + live data merging logic


  const [intradayData, setIntradayData] = useState<any[]>([]);


//   useEffect(() => {
//     setIntradayData(seriesesData.get("ID") || []);
//   }, [seriesesData]);

//   const liveData = useSelector((state: any) => state.stocks[symbol] || []);
  
// useEffect(() => {
//     if (!liveData.length) return;
  
//     const newPoints: PricePoint[] = liveData
//       .map((entry) => ({
//         time: entry.timestamp,
//         price: entry.price,
//       }))
//       .filter((point) => point.time > lastUpdateTimeRef.current)
//       .sort((a, b) => a.time - b.time);
  
//     if (newPoints.length === 0) return;
  
//     setSeriesesData((prevMap: IntradayMap) => {
//       const updatedMap = mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef);
//       setIntradayData(updatedMap.get("1D") || []);
//       return updatedMap;
//     });
//   }, [liveData, seriesesData]);

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


  console.log("series data in context is: ", seriesesData)
  
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
    isMarketOpen,
    currentPrice,
    snapShot,
    symbol_name,
    asset_type,
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
