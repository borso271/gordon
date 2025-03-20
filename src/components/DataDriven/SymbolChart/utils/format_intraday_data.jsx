
function formatIntradayData(data = []) {
    return data
      .map((entry) => ({
        time: entry.timestamp, // convert ms to seconds
        price: entry.price,
      }))
      .sort((a, b) => a.time - b.time)
      .filter((entry, idx, arr) => idx === 0 || entry.time !== arr[idx - 1].time);
  }

  export default formatIntradayData