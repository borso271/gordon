"use client"
import { useState, useEffect, useCallback,useMemo } from "react";
import { getChartData } from "../../services/database/fetch_chart_data";
import fetch_symbol_info from "../../services/database/fetch_symbol_info.js";
import returnPriceLegendSegments from "../../components/DataDriven/SymbolChart/utils/compute_price_legend/return_price_legend_metadata";
import { assign_list_XYCoordinatesIndexSimple } from "../../components/DataDriven/SymbolChart/utils/compute_point_coordinates/compute_xy_index";
import { computeHistoricalPercentage} from "../../components/DataDriven/SymbolChart/utils/compute_historical_percentage";

// Same logic, just moved into a hook:


import { PricePoint, PriceDataMap, Period} from "../../interfaces/index.js";
type DataMap = Record<string, PricePoint[]>;


function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}


export function useComparisonChart(symbols: string[], width: number, height: number) {
  // 1) Store info for each symbol
  const [infos, setInfos] = useState<Record<string, any>>({});
  const [seriesMap, setSeriesMap] = useState<Map<string, PriceDataMap>>(new Map());
  const [isMarketOpen, setMarketOpen] = useState(false);

  const debouncedWidth = useDebouncedValue(width, 150); // 150ms debounce

  const symbolsKey = useMemo(() => symbols.slice().sort().join(","), [symbols]);

  useEffect(() => {
    console.log("✅ useEffect triggered: symbols =", symbols);
    if (!symbols.length) return;
  
    async function fetchAllInfos() {
      const updatedInfos: Record<string, any> = {};
      for (const symbol of symbols) {
        try {
          const info = await fetch_symbol_info(symbol);
          updatedInfos[symbol] = info;
        } catch (err) {
          console.error(`Error fetching info for ${symbol}:`, err);
        }
      }
      setInfos(updatedInfos);
    }
  
    fetchAllInfos();
  }, [symbolsKey]);
  
  useEffect(() => {
    console.log("✅ useEffect 2 triggered: symbols =", symbols);
    if (!Object.keys(infos).length) return;

    // e.g., pick the first symbol's asset_type and exchange_mic
    const firstSymbol = symbols[0];
    const info = infos[firstSymbol];
    if (!info?.asset_type || !info?.exchange_mic) return;

    const { asset_type, exchange_mic } = info;

    async function checkMarketStatus() {
      try {
        const response = await fetch("api/market_status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asset_type, exchange_mic }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setMarketOpen(data.isOpen ?? false);
      } catch (error) {
        console.error("❌ Error checking market status:", error);
        setMarketOpen(false);
      }
    }

    checkMarketStatus();
    const interval = setInterval(() => {
      checkMarketStatus();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [infos, symbolsKey]);




  // 4) Fetch chart data for each symbol
  useEffect(() => {
    if (!Object.keys(infos).length) return;
  
    async function fetchAllCharts() {
      const newMap = new Map<string, PriceDataMap>();
  
      for (const symbol of symbols) {
        const info = infos[symbol];
        if (!info?.id || !info?.exchange_mic || !info?.asset_type) continue;
  
        try {
          const chartData = await getChartData(symbol, info.id, isMarketOpen);
          newMap.set(symbol, chartData);
        } catch (err) {
          console.error(`❌ Error fetching chart data for ${symbol}:`, err);
        }
      }
  
      // Only update state if changed
      const serializedNew = JSON.stringify([...newMap.entries()]);
      const serializedCurrent = JSON.stringify([...seriesMap.entries()]);
      if (serializedNew !== serializedCurrent) {
        setSeriesMap(newMap);
      }
    }
  
    fetchAllCharts();
  }, [infos, isMarketOpen, symbolsKey]);
  // useEffect(() => {
  //   if (!Object.keys(infos).length) return;

  //   async function fetchAllCharts() {
  //     const newMap = new Map<string, PriceDataMap>();

  //     for (const symbol of symbols) {
  //       const info = infos[symbol];
       
  //       if (!info?.id || !info?.exchange_mic || !info?.asset_type) {
  //         console.warn(`Skipping chart for ${symbol} – missing values`);
  //         continue;
  //       }

  //       try {
  //         const chartData = await getChartData(symbol, info.id, isMarketOpen);
  //         //console.log("CHART DATA IS: ", chartData)
  //         newMap.set(symbol, chartData);
  //       } catch (err) {
  //         console.error(`❌ Error fetching chart data for ${symbol}:`, err);
  //       }
  //     }
  //     setSeriesMap(newMap);
  //   }

  //   fetchAllCharts();
  // }, [infos, isMarketOpen, symbolsKey]);


  // 5) Single selectedPeriod for entire chart
  const [selectedPeriod, _setSelectedPeriod] = useState<Period>("1Y");
  const setSelectedPeriod = useCallback((period: Period) => {
    _setSelectedPeriod(period);
  }, []);
  
  

  // 6) Combine all symbols' data in `selectedPeriod` to find global min/max
  const { adjustedLow, adjustedHigh, priceLegendSegments, timeLegendPercentage } = useMemo(() => {
    let globalMin = Infinity;
    let globalMax = -Infinity;

    // console.log("adjusted low is: ", adjustedLow)

    // We'll also pick out intraday data for timeLegend if needed
    let allIntradayPoints: PricePoint[] = [];

    // Iterate each symbol
    for (const [symbol, priceDataMap] of seriesMap.entries()) {
      const pd = priceDataMap.get(selectedPeriod) || [];
      if (pd.length) {
        const localPrices = pd.map((p) => p.price);
        const localMin = Math.min(...localPrices);
        const localMax = Math.max(...localPrices);
        if (localMin < globalMin) globalMin = localMin;
        if (localMax > globalMax) globalMax = localMax;
      }
      // Also gather intraday if needed for timeLegend
      const intraday = priceDataMap.get("ID") || [];
      allIntradayPoints = allIntradayPoints.concat(intraday);
    }

    if (!isFinite(globalMin)) globalMin = 0;
    if (!isFinite(globalMax)) globalMax = 0;

    const range = globalMax - globalMin;
    const padding = range * 0.15;
    const high = globalMax + padding;
    const low = Math.floor(globalMin - padding);

    // Price legend
    const segments = returnPriceLegendSegments(low, high);

    // Time legend logic (like computeHistoricalPercentage):
    const timePercentage = computeHistoricalPercentage(allIntradayPoints, selectedPeriod);

    return {
      adjustedLow: low,
      adjustedHigh: high,
      priceLegendSegments: segments,
      timeLegendPercentage: timePercentage,
    };
  }, [seriesMap, selectedPeriod]);


  // 7) For each symbol, compute final chart data if you like
  //    We'll store a new map: symbol => { periodData, finalPeriodData }

  const chartDataMap: DataMap = useMemo(() => {
    const result: DataMap = {};
  
    for (const [symbol, priceDataMap] of seriesMap.entries()) {
      const pd = priceDataMap.get(selectedPeriod) || [];
  
      const finalCoos: any = assign_list_XYCoordinatesIndexSimple(
        pd,
        debouncedWidth,
        adjustedLow,
        adjustedHigh,
        height,
        0,
        0
      );
  
      result[symbol] = finalCoos;
    }
  
    return result;
  }, [seriesMap, selectedPeriod, adjustedHigh, adjustedLow, debouncedWidth, height]);
  


  return {
    // For each symbol, chartDataMap has { periodData, finalPeriodData }
    chartDataMap,
    selectedPeriod,
    setSelectedPeriod,
    priceLegendSegments,
    timeLegendPercentage,
    isMarketOpen,
    adjustedLow,
    adjustedHigh,
  };
}




// export function useComparisonChart(symbol: string, width: number, height: number) {

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

//   const [seriesesData, setSeriesesData] = useState<PriceDataMap>(new Map());


//   useEffect(() => {
//     if (!symbol_id || !exchange_mic || !asset_type) {
//       console.warn("⏭️ Skipping getChartData - Missing required values.");
//       return;
//     }
  
//     async function fetchChartData() {
//       try {
//         const chartData = await getChartData(symbol, symbol_id,isMarketOpen);
//         setSeriesesData(chartData);
//       } catch (err) {
//         console.error("❌ Error fetching chart data:", err);
//       }
//     }
  
//     fetchChartData();
//   }, [symbol, symbol_id, exchange_mic, asset_type, isMarketOpen]);
  



//   const [selectedPeriod, setSelectedPeriod] = useState<Period>("1D");

//   const periodData: PricePoint[] = seriesesData.get(selectedPeriod) || [];
//   const prices = periodData.map((d: any) => d.price);
//   const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
//   const dayMax = prices.length > 0 ? Math.max(...prices) : 0;


//   const range = dayMax - dayMin;
//   const padding = range * 0.15; 
//   const adjustedHigh = dayMax + padding;
//   const adjustedLow = Math.floor(dayMin - padding);


//   const priceLegendSegments = useMemo(() => {
//     return dayMin !== undefined && dayMax !== undefined
//       ? returnPriceLegendSegments(adjustedLow, adjustedHigh)
//       : [];
//   }, [dayMin, dayMax]);


// const dataPoints: PricePoint[] = seriesesData.get("ID") || [];

// const timeLegendPercentage = computeHistoricalPercentage(dataPoints, selectedPeriod);

//   // 7) Combine final chart data
//   const firstpartwidth = useMemo(() => {
//     return (width * timeLegendPercentage) / 100 - 10;
//   }, [width, timeLegendPercentage]);


//   const offsetX = selectedPeriod === "1D" ? 0 : firstpartwidth;
//   const intradaywidth = width - offsetX;

//   const finalPeriodData = useMemo(() => {
    
//     // 1) Compute periodData coords
//     const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
//       periodData,
//       firstpartwidth,
//       adjustedLow,
//       adjustedHigh,
//       height,
//       0,       
//       0       
//     );

//     // 2) Compute intraday coords
//     const intradayData_With_Coos = assign_list_XYCoordinatesIndexSimple(
//       [],
//       intradaywidth,
//       adjustedLow,
//       adjustedHigh,
//       height,
//       offsetX,
//       0 
//     );
  
//     // 3) Merge the two
//     return periodData_with_coos.concat(intradayData_With_Coos);
  
//   }, [
//     periodData,
//     [],
//     firstpartwidth,
//     intradaywidth,
//     adjustedLow,
//     adjustedHigh,
//     height,
//     width,
//     offsetX
//   ]);

//   return {
  
//     periodData,
//     finalPeriodData,

//     selectedPeriod,
//     setSelectedPeriod,
//     priceLegendSegments,
//     timeLegendPercentage,
//     isMarketOpen,
//     adjustedLow,
//     adjustedHigh,
//   };
// }
