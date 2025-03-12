
// export function getUniqueTimeSlots(dataPoints, interval) {
 
//   const slotsSet = new Set();

//   for (const dp of dataPoints) {
//     // Convert from milliseconds since epoch (already in ms)
//     const dateObj = new Date(dp.time);

//     switch (interval) {
//       case "30m": {
//         // Round minutes to 0 or 30 (always "round down")
//         const m = dateObj.getMinutes();
//         const halfHour = m < 30 ? 0 : 30;
//         dateObj.setMinutes(halfHour, 0, 0);
//         // Use ISO format
//         slotsSet.add(dateObj.toISOString()); // range error: RangeError: Invalid time value
//         break;
//       }

//       case "1h": {
//         // Round minutes, seconds, ms to zero
//         dateObj.setMinutes(0, 0, 0);

//         // Use ISO format
//         slotsSet.add(dateObj.toISOString());
//         break;
//       }

//       case "1d": {
//         // Round to midnight (start of the day)
//         dateObj.setHours(0, 0, 0, 0);

//         // Use ISO format
//         slotsSet.add(dateObj.toISOString());
//         break;
//       }

//       default:
//         console.warn(`Interval "${interval}" not supported.`);
//         break;
//     }
//   }

//   // Convert set to array and sort ascending
//   const slots = Array.from(slotsSet);
//   slots.sort(); // Lexical sort works correctly for ISO strings
//   return slots;
// }

export function getUniqueTimeSlots(dataPoints, interval) {
  const slotsSet = new Set();

  for (const dp of dataPoints) {
    if (!dp.time || isNaN(dp.time)) {
      console.warn("⚠️ Skipping invalid timestamp:", dp.time);
      continue; // Skip invalid timestamps
    }

    // Convert from milliseconds since epoch
    const dateObj = new Date(dp.time);

    switch (interval) {
      case "30m": {
        // Round minutes to 0 or 30
        const m = dateObj.getMinutes();
        dateObj.setMinutes(m < 30 ? 0 : 30, 0, 0);
        break;
      }

      case "1h": {
        // Round to the start of the hour
        dateObj.setMinutes(0, 0, 0);
        break;
      }

      case "1d": {
        // Round to the start of the day
        dateObj.setHours(0, 0, 0, 0);
        break;
      }

      case "1M": {
        // Round to the first day of the month
        dateObj.setUTCDate(1); // First day of the month
        dateObj.setUTCHours(0, 0, 0, 0);
        break;
      }

      default:
        console.warn(`⚠️ Interval "${interval}" not supported.`);
        return [];
    }

    // Add the formatted date to the set
    slotsSet.add(dateObj.toISOString());
  }

  // Convert set to array and sort ascending
  return Array.from(slotsSet).sort(); // ISO strings sort correctly
}


/**
 * pickBoundaries(uniqueDays, n):
 *  Returns an array of n+1 "boundary" day-strings, from the first day
 *  to the last day, with n-1 internal boundaries spaced as evenly as possible.
 */


function pickBoundaries(uniqueTimeSlots, n) {
  // // console.log("UNIQUE TIME SLOTS ARE:", uniqueTimeSlots);
  // // console.log("n is ", n)

  const M = uniqueTimeSlots.length;
  if (M === 0 || n < 1) return [];

  // ✅ Ensure we don't ask for more boundaries than available slots
  const boundariesCount = Math.min(n + 1, M); 
  const boundaries = [];

  for (let i = 0; i < boundariesCount; i++) {
    // fraction from 0..1
    const fraction = i / Math.max(n, 1); // ✅ Avoid division by zero
    // discrete index from 0..(M-1)
    const slotIndex = Math.round(fraction * (M - 1));
    
    if (!boundaries.includes(uniqueTimeSlots[slotIndex])) { // ✅ Avoid duplicates
      boundaries.push(uniqueTimeSlots[slotIndex]);
    }
  }

  // // console.log("BOUNDARIES ARE:", boundaries);
  return boundaries;
}





  function formatTimeLabel(timestamp, period) {

    const date = new Date(timestamp);
   // // // console.log("data is: ", date)
    if (period === "1D") {
      // Format as HH:MM
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } else if (period === "1W" || period === "1M") {
      // Format as MM/DD
      return date.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
    } else if (period === "1Y" || period === "5Y") {
      // Format as MM/YY
      return date.toLocaleDateString([], { month: "2-digit", year: "2-digit" });
    }
  
    return date.toISOString(); // Fallback
  }
  
  function buildSegmentsFromSlots(sortedSlots, interval, period, n, end_ms) {
    // console.log("end time is :", end_ms);
  
    const boundaries = pickBoundaries(sortedSlots, n);
    // console.log("boundaries are:", boundaries);
  
    const segments = [];
  
    for (let i = 0; i < n-1; i++) {
      const startTime = boundaries[i];
      const endTime = i === n - 1 ? new Date(end_ms).toISOString() : boundaries[i + 1]; // 🔥 Ensure last segment ends at `end_ms`
  
      const startTimeMs = new Date(startTime).getTime();
      const endTimeMs = i === n - 2 ? end_ms : new Date(endTime).getTime(); // 🔥 Override last segment's `endTimeMs`
  
      segments.push({
        index: i,
        start_time: startTime,
        end_time: endTime,
        start_time_ms: startTimeMs,
        end_time_ms: endTimeMs,
        label: formatTimeLabel(startTimeMs, period), // Assign formatted label
      });
    }
  
    return segments;
  }
  
  // function buildSegmentsFromSlots(sortedSlots, interval, period,n,end_ms) {
  //   //// // console.log("sorted slots are: ", sortedSlots, interval, n)
  //   const boundaries = pickBoundaries(sortedSlots, n);
  //    // console.log("boundaries are: ", boundaries)
  //   const segments = [];
  
  //   for (let i = 0; i < n; i++) {
  //     const startTime = boundaries[i];
  //     const endTime = boundaries[i + 1];

  //     // // console.log("start and end time are: ", startTime, endTime)
  
  //     const startTimeMs = new Date(startTime).getTime();
  //     const endTimeMs = new Date(endTime).getTime();

  //     // // console.log("start and end time ms are: ", startTimeMs, endTimeMs)
  
  //     segments.push({
  //       index: i,
  //       start_time: startTime,    
  //       end_time: endTime,    
  //       start_time_ms: startTimeMs,  
  //       end_time_ms: endTimeMs,  
  //       label: formatTimeLabel(startTimeMs, period), // Assign formatted label
  //     });
  //   }

  //   return segments;
  // }

  
/**
 * computeDayDateMetaData(dataPoints, interval, n)
 * 1) Only relevant for interval = "1d" (in your example).
 * 2) Extract all unique days from dataPoints.
 * 3) Pick n+1 boundaries from those discrete days.
 * 4) Return n segments: { start_time, end_time, index }
 */


import compute_intraday_date_legend_metadata from "./compute_intraday_date_legend_metadata.js";

function computeDateMetaData(dataPoints, interval,period,start_ms, end_ms, n) {

  if (period == "1D"){
   return compute_intraday_date_legend_metadata(start_ms, end_ms, n) }
    // For demonstration, handle only "1d" intervals
    // 1) Get sorted unique days
    const uniqueSlots = getUniqueTimeSlots(dataPoints, interval);
   
    // 2) Pick n+1 boundaries
    const segments = buildSegmentsFromSlots(uniqueSlots,interval,period, Math.min(uniqueSlots.length, n), end_ms);
    // // console.log("segments are: ", segments)
  
  
    return segments;
  }


export default computeDateMetaData

  /*

  example output:

  [
  { index: 0, start_time: '2025-01-02', end_time: '2025-01-03' },
  { index: 1, start_time: '2025-01-03', end_time: '2025-01-07' },
  { index: 2, start_time: '2025-01-07', end_time: '2025-01-09' }
]


if this works, it should be easy from here.

   */




