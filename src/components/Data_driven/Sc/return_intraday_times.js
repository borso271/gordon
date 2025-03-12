
// const {intraday_start_time, intraday_end_time} = return_intraday_times(todayData);

function return_intraday_times(dataPoints, exchange_mic, asset_type) {
    if (!dataPoints.length) {
        console.warn("No data points provided.");
        return { intraday_start: null, intraday_end: null };
    }

    // Get the last data point and extract the date
    const lastPoint = dataPoints[dataPoints.length - 1];
    const lastDate = new Date(lastPoint.time);

    // Extract year, month, and day
    const year = lastDate.getUTCFullYear();
    const month = lastDate.getUTCMonth();
    const day = lastDate.getUTCDate();

    let intraday_start, intraday_end;

    if (asset_type === "crypto") {
        // Crypto markets are open 24/7, from midnight to midnight
        intraday_start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).getTime();
        intraday_end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).getTime();
    } else if (asset_type === "stock" && (exchange_mic === "XNAS" || exchange_mic === "XNYS")) {
        // Stock markets open at 9:30 AM and close at 4:00 PM (Eastern Time)
        intraday_start = new Date(Date.UTC(year, month, day, 9, 30, 0, 0)).getTime(); // 9:30 AM ET
        intraday_end = new Date(Date.UTC(year, month, day, 16, 0, 0, 0)).getTime();   // 4:00 PM ET
    } else {
        console.warn("Unknown exchange MIC or asset type. Defaulting to full-day range.");
        intraday_start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).getTime();
        intraday_end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).getTime();
    }
    // // console.log("INTRAS ARE: ", intraday_start, intraday_end)

    return { intraday_start, intraday_end };
}

export default return_intraday_times;
