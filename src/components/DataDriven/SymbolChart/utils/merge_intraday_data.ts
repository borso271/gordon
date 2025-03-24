
import { PricePoint, IntradayMap, LastUpdateRef } from "../../../../interfaces";

type Period = "1D"; // extend this if other periods are used




function mergeIntradayData(
  prevMap: IntradayMap,
  newPoints: PricePoint[],
  lastUpdateTimeRef: LastUpdateRef
): IntradayMap {
  // Make a copy of the old Map
  const updatedMap = new Map(prevMap);

  if (newPoints.length === 0) return updatedMap;

  const old1D = updatedMap.get("1D") || [];
  const lastTwoPoints = newPoints.slice(-2); // Get last 2 new points
  const merged1D = [...old1D, ...lastTwoPoints];

  updatedMap.set("1D", merged1D);

  lastUpdateTimeRef.current = merged1D[merged1D.length - 1].time;

  return updatedMap;
}

export default mergeIntradayData;


// function mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef) {
//     // Make a copy of the old Map
//     const updatedMap = new Map(prevMap);

//     if (newPoints.length === 0) return updatedMap; // No new data, return unchanged map

//     // 1) Get the existing data arrays (or empty arrays if none)
//     const old1D = updatedMap.get("1D") || [];

//     // 2) Extract the relevant new points:
//     const lastTwoPoints = newPoints.slice(-2);  // Last 2 for "1D"

//     // 3) Merge with existing data:
//     const merged1D = [...old1D, ...lastTwoPoints];  // Keep only last 2 new points
    
//     // 4) Update the Map
//     updatedMap.set("1D", merged1D);
    
//     // 5) Update lastUpdateTimeRef based on "1D" (same logic as before)
//     lastUpdateTimeRef.current = merged1D[merged1D.length - 1].time;

//     return updatedMap;
// }

// export default mergeIntradayData;
