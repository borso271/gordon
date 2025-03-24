import { Period } from "../../../../interfaces";
import { PricePoint } from "../../../../interfaces";

type IntradayMap = Map<Period, PricePoint[]>;

interface LastUpdateRef {
  current: number;
}

function mergeAllTimePeriods(
  prevMap: IntradayMap,
  newPoints: PricePoint[],
  lastUpdateTimeRef: LastUpdateRef
): IntradayMap {
  const updatedMap = new Map(prevMap);

  if (newPoints.length === 0) return updatedMap;

  // Existing arrays (or empty fallback)
  const old1D = updatedMap.get("1D") || [];
  const old1W = updatedMap.get("1W") || [];
  const old1M = updatedMap.get("1M") || [];
  const old1Y = updatedMap.get("1Y") || [];
  const old5Y = updatedMap.get("5Y") || [];

  const lastTwoPoints = newPoints.slice(-2);
  const lastOnePoint = newPoints.slice(-1);

  const merged1D = [...old1D, ...lastTwoPoints];
  const merged1W = [...old1W, ...lastOnePoint];
  const merged1M = [...old1M, ...lastOnePoint];
  const merged1Y = [...old1Y, ...lastOnePoint];
  const merged5Y = [...old5Y, ...lastOnePoint];

  updatedMap.set("1D", merged1D);
  updatedMap.set("1W", merged1W);
  updatedMap.set("1M", merged1M);
  updatedMap.set("1Y", merged1Y);
  updatedMap.set("5Y", merged5Y);

  lastUpdateTimeRef.current = merged1D[merged1D.length - 1].time;

  return updatedMap;
}

export default mergeAllTimePeriods;


// function return_intraday_times(dataPoints, exchange_mic, asset_type) {
//     if (!dataPoints.length) {
//         console.warn("No data points provided.");
//         return { intraday_start: null, intraday_end: null };
//     }

//     // Get the last data point and extract the date
//     const lastPoint = dataPoints[dataPoints.length - 1];
//     const lastDate = new Date(lastPoint.time);

//     // Extract year, month, and day
//     const year = lastDate.getUTCFullYear();
//     const month = lastDate.getUTCMonth();
//     const day = lastDate.getUTCDate();

//     let intraday_start, intraday_end;

//     if (asset_type === "crypto") {
//         // Crypto markets are open 24/7, from midnight to midnight
//         intraday_start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).getTime();
//         intraday_end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).getTime();
//     } else if (asset_type === "stock" && (exchange_mic === "XNAS" || exchange_mic === "XNYS")) {
//         // Stock markets open at 9:30 AM and close at 4:00 PM (Eastern Time)
//         intraday_start = new Date(Date.UTC(year, month, day, 9, 30, 0, 0)).getTime(); // 9:30 AM ET
//         intraday_end = new Date(Date.UTC(year, month, day, 16, 0, 0, 0)).getTime();   // 4:00 PM ET
//     } else {
//         console.warn("Unknown exchange MIC or asset type. Defaulting to full-day range.");
//         intraday_start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).getTime();
//         intraday_end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).getTime();
//     }
//     // // console.log("INTRAS ARE: ", intraday_start, intraday_end)

//     return { intraday_start, intraday_end };
// }

// export default return_intraday_times;
