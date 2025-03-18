import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./SymbolChart.module.css";
import PeriodSelector from "./components/PeriodSelector/index.jsx";
import ChartCanvas from "./components/ChartCanvas";
import getChartData from "../../../services/get_components_data/fetch_chart_data.js";
import mergeIntradayData from "./utils/merge_intraday_data.jsx";
import ChartSnapshot from "./components/ChartSnapShot/index.jsx";
import getSymbolSnapshot from "../../../services/get_components_data/get_symbol_snapshot.js";
import fetch_symbol_info from "../../../utils/fetch_symbol_info.js";
import formatTimestamp from "./utils/format_timestsamp.jsx";
import isMarketOpenNow from "../../../utils/is_market_open_now.js";
import returnPriceLegendSegments from "./components/utils/compute_price_legend/return_price_legend_metadata.js";
import PriceLegend from "./components/PriceLegend/index.jsx";
import { assign_list_XYCoordinatesIndexSimple } from "./components/utils/compute_x_y/compute_xy_index.js";
import PriceChangeOverview from "./components/PriceChangeOverview/index.jsx";
import computeLastPrices from "./compute_last_prices.js";
import PriceMiniOverview from "./components/PriceMiniOverview/index.jsx";
import computeHistoricalPercentage from "./compute_historical_percentage.js";
import PrimaryDivider from "../../Layout/PrimaryDivider";
import ChartLoader from "../../Loaders/ChartLoader";
const Sc = ({ symbol}) => {

  const chartRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 748, height: 220 });

  // Function to update chart dimensions
  const updateChartSize = () => {
    if (chartRef.current) {
      setChartDimensions({
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
      });
    }
  };

  // Effect to track changes in chart size
  useEffect(() => {
    updateChartSize(); // Initial size
    window.addEventListener("resize", updateChartSize); // Listen to window resize

    return () => window.removeEventListener("resize", updateChartSize); // Cleanup
  }, []);

  
  const [isMarketOpen, setMarketOpen] = useState(false);
  const [symbolInfo, setSymbolInfo] = useState(null);
  // now that you have is market open
  useEffect(() => {
    async function fetchData() {
      if (!symbol) return; // Avoid fetching with an empty symbol

      try {
        const info = await fetch_symbol_info(symbol);
        
        setSymbolInfo(info);

  //console.log("symbol info is: ", symbolInfo)
      } catch (error) {
        console.error("Error fetching symbol info:", error);
      }
    }

    fetchData();
  }, [symbol]); // Runs whenever `symbol` changes


  const symbol_id = symbolInfo?.id || null;
  const exchange_mic = symbolInfo?.exchange_mic || null;
  const asset_type = symbolInfo?.asset_type || null;
  const symbol_name = symbolInfo?.name || null;

  
  const [snapShot, setSnapshot] = useState({"last_close": 0, "currency": "-"});

  const [selectedPeriod, setSelectedPeriod] = useState("1D");

  // Store all period data in a Map
  
  //
  const [seriesesData, setSeriesesData] = useState(new Map());

  // Keep track of the last known time to avoid adding older points

  const lastUpdateTimeRef = useRef(0);

  // Live data from Redux

  const liveData = useSelector((state) => state.stocks[symbol] || []);

  const checkMarketStatus = async () => {
    try {
      const marketOpen = await isMarketOpenNow(asset_type, exchange_mic);

      setMarketOpen(true); // This triggers a re-render if the value changes
      
    } catch (error) {
      console.error("Error checking market status:", error);
    }
  };
 
  useEffect(() => {
    if (!symbol_id) return; // ✅ Prevent running with null symbol_id
  
    async function fetchSnapshot() {
      try {
        const data = await getSymbolSnapshot(symbol, asset_type,symbol_id);
       // console.log("Fetched snapshot data:", data);
        setSnapshot(data || { last_close: 0, currency: "-" });
      } catch (error) {
        console.error("🚨 Error fetching snapshot:", error);
      }
    }
  
    fetchSnapshot();
  }, [symbol_id]); // ✅ Now runs when `symbol_id` updates


  useEffect(() => {
    if (!asset_type || !exchange_mic) return; // Skip execution if either is null
  
    checkMarketStatus(); // Initial check when dependencies are set
  
    const interval = setInterval(() => {
      checkMarketStatus();
    }, 60 * 1000); // Every minute
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [asset_type, exchange_mic]); // ✅ Re-run if asset_type or exchange_mic changes

   
  useEffect(() => {
   // console.log("Effect triggered. Values:", { symbol_id, exchange_mic, asset_type });
  
    if (!symbol_id || !exchange_mic || !asset_type) {
      console.warn("⏭️ Skipping getChartData - Missing required values.");
      return;
    }
  
   // console.log("✅ Calling getChartData with:", symbol_id, exchange_mic, asset_type);
    getChartData(symbol, symbol_id, exchange_mic, asset_type, isMarketOpen, lastUpdateTimeRef, setSeriesesData);
  }, [symbol_id, exchange_mic, asset_type]);
  

  const [intradayData, setIntradayData] = useState([]);

  useEffect(() => {
    setIntradayData(seriesesData.get("ID") || []);
  }, [seriesesData]); // ✅ Runs whenever seriesesData changes
  useEffect(() => {
    if (!liveData.length) return; // nothing to merge
  
    const newPoints = liveData
      .map((entry) => ({
        time: entry.timestamp,
        price: entry.price,
      }))
      .filter((point) => point.time > lastUpdateTimeRef.current) // only newer than last known
      .sort((a, b) => a.time - b.time);
  
    if (newPoints.length === 0) return;
  
    setSeriesesData((prevMap) => {
      const updatedMap = mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef);
  
      // Update intradayData when seriesesData changes
      setIntradayData(updatedMap.get("ID") || []); // ✅ Update state with new data
  
      return updatedMap;
    });
    
  }, [liveData, seriesesData]); // ✅ Add dependencies to update when they change

// console.log("TODAY DATA IS; ", intradayData)

  const periodData = seriesesData.get(selectedPeriod) || [];
  const prices = periodData.map((d) => d.price);
  const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
  const dayMax = prices.length > 0 ? Math.max(...prices) : 0;
  
  const preferredPeriod = "ID";  // Change this to the actual preferred key
const fallbackPeriod = "1D";   // Fallback to "1D" if preferred is empty

const mostRecentPeriodData = seriesesData.get(preferredPeriod)?.length
  ? seriesesData.get(preferredPeriod)
  : seriesesData.get(fallbackPeriod);

  const currentPrice = mostRecentPeriodData?.length 
  ? mostRecentPeriodData[mostRecentPeriodData.length - 1].price 
  : snapShot.last_close || 0;

const lastUpdatedTimestamp = mostRecentPeriodData?.length 
? mostRecentPeriodData[mostRecentPeriodData.length - 1].time 
: snapShot.last_close_unix || 0; // Default to 0 if the list is empty or undefined

const lastUpdated = formatTimestamp(lastUpdatedTimestamp)

const stablePeriodData = useMemo(() => {
  return periodData; // Only updates if periodData changes in a relevant way
}, [selectedPeriod]); // ✅ Only updates when the selected period changes

const yoffset = 0; //-30;
const range = dayMax - dayMin; // Compute the range between high and low
const padding = range * 0.15;   // Compute 10% of the range

const adjustedHigh = dayMax + padding; // Add 10% of range to high removed Math.ceil(
const adjustedLow = Math.floor(dayMin - padding); // Subtract 10% of range from low

const priceLegendSegments = useMemo(() => {
  return dayMin !== undefined && dayMax !== undefined 
    ? returnPriceLegendSegments(adjustedLow, adjustedHigh) 
    : [];
}, [dayMin, dayMax]); // ✅ Recomputes only when dependencies change

const lastTimeStamp = useMemo(() => {
  let selectedMap = seriesesData.get("ID");

  // If "1D" is empty, try "1W"
  if (!selectedMap || selectedMap.length === 0) {
    console.warn("⚠️ No data in 'ID', falling back to '1D'");
    selectedMap = seriesesData.get("1D");
  }

  //console.log("SELECTED MAP IS: ", selectedMap)
  // If "1W" is also empty, return null

  if (!selectedMap || selectedMap.length === 0) {
    console.warn("⚠️ No data available in both 'ID' and '1D'");
    return null;
  }

  return selectedMap[selectedMap.length - 1].time;
}, [seriesesData]); // ✅ Updates only when `seriesesData` changes


const timeLegendPercentage = computeHistoricalPercentage(intradayData, selectedPeriod)


  const firstpartwidth = (chartDimensions.width*timeLegendPercentage/100)-20;
  // ✅ Compute period data using dynamic width & height
  
  const lastPrices = computeLastPrices(seriesesData)

  const offsetX = selectedPeriod=="1D"? 0 : firstpartwidth;

  const intradaywidth = chartDimensions.width-offsetX;

  const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
    periodData,
    firstpartwidth,  // 🔥 Use dynamic width
    adjustedLow,
    adjustedHigh,
    chartDimensions.height, // 🔥 Use dynamic height
    0,
    yoffset,
  );
  
  const intradayData_With_Coos = assign_list_XYCoordinatesIndexSimple(intradayData, intradaywidth, adjustedLow, adjustedHigh, chartDimensions.height, offsetX, yoffset)

  const finalPeriodData = periodData_with_coos.concat(intradayData_With_Coos)
  
  const timeLegendWidth = timeLegendPercentage + "%"; // Example: Set dynamically based on a variable
   
  const [relevant_close, setRelevantClose] = useState(0);

  useEffect(() => {
    if (periodData.length > 0) {
      setRelevantClose(periodData[0]?.price || 0);
    }
  }, [periodData,selectedPeriod]); // Runs whenever periodData changes
  
  const isPositiveChange = currentPrice > relevant_close
  if (!currentPrice || !periodData) {
    return <ChartLoader/>
  }
  return (
    <div className={styles.chartContainer}>
      <div className={styles.container}>

        <div className={styles.chartTop}>
        <ChartSnapshot symbol={symbol} asset_type={asset_type} name={symbol_name} latestPrice={currentPrice} lastClose={snapShot.last_close} currency={snapShot.currency} lastUpdated={lastUpdated} />

      <div className={styles.topRight}>
      <h4 className={styles.lastUpdated}>As of {lastUpdated}</h4>
       
      <PriceChangeOverview current_price={currentPrice} changes={lastPrices} />
      </div>

        </div>
        <PrimaryDivider className={styles.divider}></PrimaryDivider> 

        <div className={styles.chartMain}>
        <div className={styles.chartOverview}>
         
        <PriceMiniOverview current_price={currentPrice} changes={lastPrices} period={selectedPeriod}/>
        <PeriodSelector selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />

        </div>
      
        <div className={styles.chartGrid}
        style={{
          '--time-legend-width': timeLegendWidth, // Pass dynamic width to CSS
        }}
        >
          {/* ✅ Attach ref to the ChartCanvas */}
          <PriceLegend height={chartDimensions.height} metadata={priceLegendSegments} yoffset={yoffset} />

          <div ref={chartRef} className={styles.chartWrapper}
         
          >
          <ChartCanvas
              data={finalPeriodData}
              selectedPeriod={selectedPeriod}
              minTime={periodData.length ? periodData[0].time : 0}
              maxTime={periodData.length ? periodData[periodData.length - 1].time : 10}
              minPrice={adjustedLow}
              maxPrice={adjustedHigh}
              isPositiveChange={isPositiveChange}
              
            />
          </div>
  
          </div>
          {/* <TimeLegend width={chartDimensions.width} timeRanges={dateLegendSegments} startMs={start_ms} endMs={end_ms} intradayPercentage={timeLegendPercentage} marketOpen={isMarketOpen} period={selectedPeriod} /> */}
        </div>
  
      </div>
    </div>
  );
};

export default Sc;


