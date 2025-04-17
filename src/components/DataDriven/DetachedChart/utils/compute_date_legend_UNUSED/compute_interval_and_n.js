

/*
this is another function that does it
depending on the period

1D, 1W, 1M, 1Y, 5Y

and based on the data (historical data we have...)


or not only historical data?
I mean you already have the historical data that has a first and last.
So the first and last is really the historical data,
is more computing the n.
Computing the n must probably be done depending on how many elements you have and the max number of
labels that you want to display.

Or maybe just make the list, since this is really easy.
Or, depending on the START, END, AND granularity, you might compute what is the optimal n.

This might be the way.
So you have some data, and you can take the first and last.
And you have an interval...

ROUND THE FIRST AND LAST IF NEEDED ?

*/

/*
for week, month, year and 5 years, you can set the number you want based on the screen size:
small, medium, large.

for the day you might have a difference depending on whether it is crypto or stock,
but do it in a dictionary kind of way.


*/

// A single dictionary with consistent nesting for all periods.
const chartConfig = {
    "1D": {
      large: {
        stock: { interval: "30m", n: 14 },  // e.g. 7 hours trading => 14 half-hours
        crypto: { interval: "1h", n: 13 },  // e.g. 24 hours => 12 two-hour segments
      },
      medium: {
        stock: { interval: "30m", n: 10 },
        crypto: { interval: "1h", n: 8 },
      },
      small: {
        stock: { interval: "30m", n: 6 },
        crypto: { interval: "1h", n: 4 },
      },
    },
  
    "1W": {
      // For 1W, we might not care about screen size,
      // but we still define all three keys for consistency.
      large: {
        stock: { interval: "1h", n: 10 }, // M-F
        crypto: { interval: "1h", n: 10 },// 7 days
      },
      medium: {
        stock: { interval: "1d", n: 5 },
        crypto: { interval: "1d", n: 7 },
      },
      small: {
        stock: { interval: "1d", n: 5 },
        crypto: { interval: "1d", n: 7 },
      },
    },
  
    "1M": {
      // For 1M, let's do daily intervals. 
      // Adjust `n` for screen size
      large: {
        stock: { interval: "1d", n: 12 },
        crypto: { interval: "1d", n: 12 },
      },
      medium: {
        stock: { interval: "1d", n: 8 },
        crypto: { interval: "1d", n: 8 },
      },
      small: {
        stock: { interval: "1d", n: 4 },
        crypto: { interval: "1d", n: 4 },
      },
    },
  
    "1Y": {
      // For 1 year, let's use monthly intervals, 
      // but differ screen size so the chart doesn't get too crowded.
      large: {
        stock: { interval: "1M", n: 12 },
        crypto: { interval: "1M", n: 12 },
      },
      medium: {
        stock: { interval: "1M", n: 8 },
        crypto: { interval: "1M", n: 8 },
      },
      small: {
        stock: { interval: "1M", n: 6 },
        crypto: { interval: "1M", n: 6 },
      },
    },
  
    "5Y": {
      // For 5 years, monthly intervals are still OK, 
      // but we might vary 'n' so it doesn't get too busy on small screens.
      large: {
        stock: { interval: "1M", n: 12 },
        crypto: { interval: "1M", n: 12 },
      },
      medium: {
        stock: { interval: "1M", n: 8 },
        crypto: { interval: "1M", n: 8 },
      },
      small: {
        stock: { interval: "1M", n: 6 },
        crypto: { interval: "1M", n: 6 },
      },
    },
  };

  
  export function chooseChartConfig(period, screenSize, assetType) {
    const periodObj = chartConfig[period];
    if (!periodObj) {
      console.warn(`❌ Unknown period "${period}". Defaulting to "1D" => large => stock.`);
      return chartConfig["1D"].large.stock;
    }
  
    const screenObj = periodObj[screenSize];
    if (!screenObj) {
      console.warn(`❌ No config for screenSize="${screenSize}" in period="${period}". Defaulting to large.`);
      return periodObj.large.stock;
    }
  
    const config = screenObj[assetType];
    if (!config) {
      console.warn(`❌ No config for assetType="${assetType}" in period="${period}" + screenSize="${screenSize}". Defaulting to stock.`);
      return screenObj.stock;
    }
  
    return config; // { interval: string, n: number }
  }

  