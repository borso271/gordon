import { PricePoint } from "../../../../interfaces";
interface RawIntradayDataPoint {
  timestamp: number; // in milliseconds
  price: number;
}

function formatIntradayData(data: RawIntradayDataPoint[] = []): PricePoint[] {
  return data
    .map((entry) => ({
      time: Math.floor(entry.timestamp / 1000), // Convert ms to seconds
      price: entry.price,
    }))
    .sort((a, b) => a.time - b.time)
    .filter((entry, idx, arr) => idx === 0 || entry.time !== arr[idx - 1].time);
}

export default formatIntradayData;


// function formatIntradayData(data = []) {
//     return data
//       .map((entry) => ({
//         time: entry.timestamp, // convert ms to seconds
//         price: entry.price,
//       }))
//       .sort((a, b) => a.time - b.time)
//       .filter((entry, idx, arr) => idx === 0 || entry.time !== arr[idx - 1].time);
//   }

//   export default formatIntradayData