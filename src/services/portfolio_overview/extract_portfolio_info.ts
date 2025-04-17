interface PortfolioItem {
    symbol_id: number;
    quantity: number | null;
    avg_price: number | null;
    current_price: number | null;
    change: number | null; // % change
    ticker: string;
    name: string;
    asset_type: string;
    sector: string;
    exchange_mic: string;
    // other fields: first_acquired, last_close, day_high, day_low, updated, etc.
  }
  
  interface AnalysisResult {
    numberOfAssets: number;
    topPerformers: {
      id: number;
      ticker: string;
      name: string;
      current_price: number;
      change: number;
    }[];
    topLosers: {
      id: number;
      ticker: string;
      name: string;
      current_price: number;
      change: number;
    }[];
    assetsTypeAllocation: {
      stock: number;
      crypto: number;
      etf: number;
    };
    stockSectorAllocation: Record<string, number>;
    unrealizedGainOrLoss: number;
  }
  
  /**
   * Analyze the given portfolio list and return the result object.
   * 
   * @param list A list of portfolio items enriched with current_price, change, etc.
   * @returns AnalysisResult
   */
  export function analyzePortfolio(list: PortfolioItem[]): AnalysisResult {
    // 1) Filter out invalid items (missing critical fields)
    const valid = list.filter((item) => {
      return (
        item.quantity != null &&
        item.quantity > 0 && // skip zero quantity
        item.avg_price != null &&
        item.avg_price > 0 && // skip zero avg price
        item.current_price != null &&
        item.change != null &&
        item.ticker.length > 0
      );
    });
  
    // 2) numberOfAssets
    const numberOfAssets = valid.length;
  
    // 3) Top performers & top losers
    // Separate items into gainers vs. losers using item.change
    const gainers = valid.filter((item) => item.change! >= 0);
    const losers = valid.filter((item) => item.change! < 0);
  
    // Sort each group
    // gainers sorted descending by item.change
    gainers.sort((a, b) => (b.change! - a.change!));
    // losers sorted ascending by item.change
    losers.sort((a, b) => (a.change! - b.change!));
  
    // topPerformers = first 5 from gainers
    const topPerformers = gainers.slice(0, 5).map((item) => ({
      id: item.symbol_id,
      ticker: item.ticker,
      name: item.name,
      current_price: item.current_price!,
      change: item.change!
    }));
  
    // topLosers = first 5 from losers
    const topLosers = losers.slice(0, 5).map((item) => ({
      id: item.symbol_id,
      ticker: item.ticker,
      name: item.name,
      current_price: item.current_price!,
      change: item.change!
    }));
  
    // 4) Assets Type Allocation
    // compute total market value for each item => quantity * current_price
    // sum by asset_type
    let totalValue = 0;
    const typeValueMap: Record<string, number> = { stock: 0, crypto: 0, etf: 0 };
  
    valid.forEach((item) => {
      const marketValue = item.quantity! * item.current_price!;
      totalValue += marketValue;
  
      if (item.asset_type === "stock" || item.asset_type === "crypto" || item.asset_type === "etf") {
        typeValueMap[item.asset_type] += marketValue;
      }
    });
  
    // now convert to percentages
    const assetsTypeAllocation = {
      stock: 0,
      crypto: 0,
      etf: 0,
    };
    if (totalValue > 0) {
      assetsTypeAllocation.stock = (typeValueMap.stock / totalValue) * 100;
      assetsTypeAllocation.crypto = (typeValueMap.crypto / totalValue) * 100;
      assetsTypeAllocation.etf = (typeValueMap.etf / totalValue) * 100;
    }
  
    // 5) Stock Sector Allocation
    // only for stocks => sum marketValue by sector
    const sectorValueMap: Record<string, number> = {};
    let totalStockValue = 0;
  
    valid
      .filter((item) => item.asset_type === "stock")
      .forEach((item) => {
        const marketValue = item.quantity! * item.current_price!;
        totalStockValue += marketValue;
        if (!sectorValueMap[item.sector]) {
          sectorValueMap[item.sector] = 0;
        }
        sectorValueMap[item.sector] += marketValue;
      });
  
    const stockSectorAllocation: Record<string, number> = {};
    if (totalStockValue > 0) {
      Object.entries(sectorValueMap).forEach(([sector, val]) => {
        stockSectorAllocation[sector] = (val / totalStockValue) * 100;
      });
    }
  
    // 6) Unrealized Gain or Loss
    // Sum((current_price - avg_price) * quantity)
    let unrealizedGainOrLoss = 0;
    valid.forEach((item) => {
      const itemGain = (item.current_price! - item.avg_price!) * item.quantity!;
      unrealizedGainOrLoss += itemGain;
    });
  
    return {
      numberOfAssets,
      topPerformers,
      topLosers,
      assetsTypeAllocation,
      stockSectorAllocation,
      unrealizedGainOrLoss,
    };
  }
  