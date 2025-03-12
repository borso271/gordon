
function formatHistoricalData(data = []) {
    return data
      .map((entry) => ({
        time: entry.timestamp, // to UNIX seconds
        price: entry.close,
      }))
      .sort((a, b) => a.time - b.time)
      .filter((entry, idx, arr) => idx === 0 || entry.time !== arr[idx - 1].time);
  }
  
  export default formatHistoricalData