import { Period, PricePoint } from "../../../../interfaces";
// interface IntradayDataPoint {
//   timestamp: number; // assuming UNIX timestamp in milliseconds
// }

export function computeHistoricalPercentage(intradayData: PricePoint[], period: Period): number {
  if (!intradayData.length) return 100;

  const timestamps = intradayData.map(data => data.time); // ✅ use `.time` instead of `.timestamp`
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const intradayTimespan = (maxTimestamp - minTimestamp) / (1000 * 60 * 60); // in hours

  const periodTotalTimes: Record<Period, number> = {
    "ID": 8,
    "1D": 8,
    "1W": 8 * 6,
    "1M": 8 * 30,
    "1Y": 8 * 100,
    "5Y": 8 * 100,
  };

  const totalTime = periodTotalTimes[period];
  const percentage = ((totalTime - intradayTimespan) / totalTime) * 100;

  return Math.max(0, Math.min(100, percentage));
}


// function computeHistoricalPercentage(intradayData, period) {
//     let historicalPercentage = 100; // Default value

//     // If intraday data is empty, return the default historical percentage
//     if (!intradayData.length) return historicalPercentage;

//     // Compute the timespan of intraday data
//     const timestamps = intradayData.map(data => data.timestamp);
//     const minTimestamp = Math.min(...timestamps);
//     const maxTimestamp = Math.max(...timestamps);
//     const intradayTimespan = (maxTimestamp - minTimestamp) / (1000 * 60 * 60); // Convert ms to hours

//     // Define total time per period in hours
//     const periodTotalTimes = {
//         "1D": 8,      // 8 hours in a single trading day
//         "1W": 8 * 6,  // 6 trading days (assuming market is open on Saturdays)
//         "1M": 8 * 30, // 30 trading days
//         "1Y": 8 * 100, // Approximate 100 trading days (to account for weekends/holidays)
//         "5Y": 8 * 100 // Approximate 500 trading days
//     };

//     const totalTime = periodTotalTimes[period] || 8; // Default to 8 hours if period is unknown
//     // Compute historical percentage
//     historicalPercentage = ((totalTime - intradayTimespan) / totalTime) * 100;

//     return Math.max(0, Math.min(100, historicalPercentage)); // Ensure percentage is between 0-100
// }

// export default computeHistoricalPercentage

