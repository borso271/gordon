

type MetricEntry = {
    ticker: string;
    data: {
      [metric: string]: {
        value?: string;
        one_quarter_trend?: string;
        one_year_trend?: string;
      };
    };
  };
  
  export function extractFinancialMetricData(rawData: any[]): MetricEntry[] {
    return rawData.map((entry) => {
      const { ticker_symbol, data_for_ai } = entry;
      const financials = data_for_ai?.["Financials"] ?? {};
  
      // Flatten everything under Financials (which may include Balance Sheet, Income Statement, etc.)
      const flattenedMetrics: MetricEntry["data"] = {};
  
      for (const category of Object.values(financials)) {
        if (category && typeof category === "object") {
          for (const [label, value] of Object.entries(category)) {
            flattenedMetrics[label] = value as {
              value?: string;
              one_quarter_trend?: string;
              one_year_trend?: string;
            };
          }
        }
      }
  
      return {
        ticker: ticker_symbol,
        data: flattenedMetrics,
      };
    });
  }


type ComparisonEntry = {
    ticker: string;
    name: string;
    rsi: string;
    sma: string;
    ema: string;
    action: string;
    asset_type: string;
  };
  
  export function extractDataForComparisonTable(rawData: any[]): ComparisonEntry[] {
    return rawData.map((entry) => {
      const { ticker_symbol, data_for_ai} = entry;
  
      const name = data_for_ai?.["Company Profile"]?.name ?? "N/A";
  
      const rsiValue = data_for_ai?.["Technical Indicators"]?.["Relative Strength Index"];
      const smaValue = data_for_ai?.["Technical Indicators"]?.["Simple Moving Average"];
      const emaValue = data_for_ai?.["Technical Indicators"]?.["Exponential Moving Average"];
  
      const rsi = rsiValue !== undefined ? Number(rsiValue).toFixed(1) : "—";
      const sma = smaValue !== undefined ? `$${Number(smaValue).toFixed(2)}` : "—";
      const ema = emaValue !== undefined ? `$${Number(emaValue).toFixed(2)}` : "—";
  
      // Optional: logic to generate a suggested "action" based on RSI or other indicators
      let action = "—";
      const rsiNum = parseFloat(rsi);
      if (!isNaN(rsiNum)) {
        if (rsiNum < 30) action = "Buy";
        else if (rsiNum > 70) action = "Sell";
        else action = "Hold";
      }
  
      return {
        ticker: ticker_symbol,
        name,
        rsi,
        sma,
        ema,
        action,
        asset_type: entry.asset_type || "stock", // fallback to stock if not present
      };
    });
  }
  

export function extractTickerSymbols(rawData: any[]): string[] {
    return rawData.map((entry) => entry.ticker_symbol);
  }
  