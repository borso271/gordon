

function mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef) {
    // Make a copy of the old Map
    const updatedMap = new Map(prevMap);

    // console.log("newpoints are: ", newPoints);

    if (newPoints.length === 0) return updatedMap; // No new data, return unchanged map

    // 1) Get the existing data arrays (or empty arrays if none)
    const old1D = updatedMap.get("1D") || [];

    // 2) Extract the relevant new points:
    const lastTwoPoints = newPoints.slice(-2);  // Last 2 for "1D"
    const lastOnePoint = newPoints.slice(-1);   // Last 1 for other periods

    // 3) Merge with existing data:
    const merged1D = [...old1D, ...lastTwoPoints];  // Keep only last 2 new points
    

    // 4) Update the Map
    updatedMap.set("1D", merged1D);
    
    // 5) Update lastUpdateTimeRef based on "1D" (same logic as before)
    lastUpdateTimeRef.current = merged1D[merged1D.length - 1].time;

    return updatedMap;
}

export default mergeIntradayData;
