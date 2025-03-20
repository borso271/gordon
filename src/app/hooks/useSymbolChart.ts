import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";

import getChartData from "../../services/get_components_data/fetch_chart_data.js";
import mergeIntradayData from "../../components/DataDriven/SymbolChart/utils/merge_intraday_data.jsx";
import getSymbolSnapshot from "../../services/get_components_data/get_symbol_snapshot.js";
import fetch_symbol_info from "../../utils/fetch_symbol_info.js";
import formatTimestamp from "../../components/DataDriven/SymbolChart/utils/format_timestsamp.jsx";
import isMarketOpenNow from "../../utils/is_market_open_now.js";
import returnPriceLegendSegments from "../../components/DataDriven/SymbolChart/components/utils/compute_price_legend/return_price_legend_metadata";
import { assign_list_XYCoordinatesIndexSimple } from "../../components/DataDriven/SymbolChart/components/utils/compute_x_y/compute_xy_index.js";
import computeLastPrices from "../../components/DataDriven/SymbolChart/compute_last_prices.js";
import computeHistoricalPercentage from "../../components/DataDriven/SymbolChart/compute_historical_percentage.js";


// Same logic, just moved into a hook:
export function useSymbolChart(symbol: string) {
  // 1) Sizing logic
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 696, height: 220 });

  const updateChartSize = () => {
    if (chartRef.current) {
      setChartDimensions((prev) => ({
        width: chartRef.current.clientWidth || prev.width,
        height: chartRef.current.clientHeight || prev.height,
      }));
    }
  };

  useEffect(() => {
    // Small delay to ensure layout has settled
    setTimeout(updateChartSize, 500); 
    // Initial size
    updateChartSize(); 
    // Listen to window resize
    window.addEventListener("resize", updateChartSize); 
    return () => window.removeEventListener("resize", updateChartSize); 
  }, []);

  // 2) Symbol info + snapshot logic
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
  const checkMarketStatus = async () => {
    try {
      const marketOpen = await isMarketOpenNow(asset_type, exchange_mic);
      setMarketOpen(marketOpen);
    } catch (error) {
      console.error("Error checking market status:", error);
    }
  };
  useEffect(() => {
    if (!asset_type || !exchange_mic) return;
    // Check once
    checkMarketStatus();
    // Check every minute
    const interval = setInterval(() => {
      checkMarketStatus();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [asset_type, exchange_mic]);

  // 4) Chart data logic
  const [seriesesData, setSeriesesData] = useState<Map<string, any>>(new Map());
  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!symbol_id || !exchange_mic || !asset_type) {
      console.warn("⏭️ Skipping getChartData - Missing required values.");
      return;
    }
    getChartData(symbol, symbol_id, exchange_mic, asset_type, isMarketOpen, lastUpdateTimeRef, setSeriesesData);
  }, [symbol_id, exchange_mic, asset_type]);

  // 5) Intraday data + live data merging logic
  const [intradayData, setIntradayData] = useState<any[]>([]);
  useEffect(() => {
    setIntradayData(seriesesData.get("ID") || []);
  }, [seriesesData]);

  const liveData = useSelector((state: any) => state.stocks[symbol] || []);
  useEffect(() => {
    if (!liveData.length) return;
    const newPoints = liveData
      .map((entry: any) => ({
        time: entry.timestamp,
        price: entry.price,
      }))
      .filter((point: any) => point.time > lastUpdateTimeRef.current)
      .sort((a: any, b: any) => a.time - b.time);

    if (newPoints.length === 0) return;
    setSeriesesData((prevMap) => {
      const updatedMap = mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef);
      setIntradayData(updatedMap.get("ID") || []);
      return updatedMap;
    });
  }, [liveData, seriesesData]);

  // 6) Period + computed values
  const [selectedPeriod, setSelectedPeriod] = useState("1D");
  const periodData = seriesesData.get(selectedPeriod) || [];
  const prices = periodData.map((d: any) => d.price);
  const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
  const dayMax = prices.length > 0 ? Math.max(...prices) : 0;

  const preferredPeriod = "ID";
  const fallbackPeriod = "1D";
  const mostRecentPeriodData = seriesesData.get(preferredPeriod)?.length
    ? seriesesData.get(preferredPeriod)
    : seriesesData.get(fallbackPeriod);
  const currentPrice = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].price
    : snapShot.last_close || 0;
  const lastUpdatedTimestamp = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].time
    : snapShot.last_close_unix || 0;

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

  const timeLegendPercentage = computeHistoricalPercentage(seriesesData.get("ID") || [], selectedPeriod);

  const [relevant_close, setRelevantClose] = useState(0);
  useEffect(() => {
    if (periodData.length > 0) {
      setRelevantClose(periodData[0]?.price || 0);
    }
  }, [periodData, selectedPeriod]);

  const isPositiveChange = currentPrice > relevant_close;

  // 7) Combine final chart data
  const firstpartwidth = useMemo(() => {
    return (chartDimensions.width * timeLegendPercentage) / 100 - 10;
  }, [chartDimensions.width, timeLegendPercentage]);

  const lastPrices = computeLastPrices(seriesesData);
  const offsetX = selectedPeriod === "1D" ? 0 : firstpartwidth;
  const intradaywidth = chartDimensions.width - offsetX;

  const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
    periodData,
    firstpartwidth,
    adjustedLow,
    adjustedHigh,
    chartDimensions.height,
    0,
    0 // yoffset
  );
  const intradayData_With_Coos = assign_list_XYCoordinatesIndexSimple(
    intradayData,
    intradaywidth,
    adjustedLow,
    adjustedHigh,
    chartDimensions.height,
    offsetX,
    0 // yoffset
  );
  const finalPeriodData = periodData_with_coos.concat(intradayData_With_Coos);

  // ✅ Return everything needed by SymbolChart's rendering
  return {
    chartRef,
    chartDimensions,
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
