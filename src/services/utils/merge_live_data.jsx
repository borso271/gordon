

function mergeAllTimePeriods(prevMap, newPoints, lastUpdateTimeRef) {
    // Make a copy of the old Map
    const updatedMap = new Map(prevMap);

    //console.log("newpoints are: ", newPoints);

    if (newPoints.length === 0) return updatedMap; // No new data, return unchanged map

    // 1) Get the existing data arrays (or empty arrays if none)
    const old1D = updatedMap.get("1D") || [];
    const old1W = updatedMap.get("1W") || [];
    const old1M = updatedMap.get("1M") || [];
    const old1Y = updatedMap.get("1Y") || [];
    const old5Y = updatedMap.get("5Y") || [];

    // 2) Extract the relevant new points:
    const lastTwoPoints = newPoints.slice(-2);  // Last 2 for "1D"
    const lastOnePoint = newPoints.slice(-1);   // Last 1 for other periods

    // 3) Merge with existing data:
    const merged1D = [...old1D, ...lastTwoPoints];  // Keep only last 2 new points
    const merged1W = [...old1W, ...lastOnePoint];   // Keep only last new point
    const merged1M = [...old1M, ...lastOnePoint];
    const merged1Y = [...old1Y, ...lastOnePoint];
    const merged5Y = [...old5Y, ...lastOnePoint];

    // 4) Update the Map
    updatedMap.set("1D", merged1D);
    updatedMap.set("1W", merged1W);
    updatedMap.set("1M", merged1M);
    updatedMap.set("1Y", merged1Y);
    updatedMap.set("5Y", merged5Y);

    // 5) Update lastUpdateTimeRef based on "1D" (same logic as before)
    lastUpdateTimeRef.current = merged1D[merged1D.length - 1].time;

    return updatedMap;
}

export default mergeAllTimePeriods;
