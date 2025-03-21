import { PricePoint } from "../../../../app/interfaces";
interface RawHistoricalDataPoint {
  timestamp: number; // assumed to be in UNIX seconds or ms
  close: number;
}

function formatHistoricalData(data: RawHistoricalDataPoint[] = []): PricePoint[] {
  return data
    .map((entry) => ({
      time: entry.timestamp,
      price: entry.close,
    }))
    .sort((a, b) => a.time - b.time)
    .filter((entry, idx, arr) => idx === 0 || entry.time !== arr[idx - 1].time);
}

export default formatHistoricalData;
