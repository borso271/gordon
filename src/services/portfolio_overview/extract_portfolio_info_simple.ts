type PortfolioItem = {
    symbol_id: number | null;
    ticker: string | null;
    name: string | null;
    currency: string | null;
    quantity: number;
    avg_price: number;
    asset_type: string;
    last_close: number | null;
    first_acquired: string | null;
    last_updated: string;
    created_at: string;
    last_price: number | null;
    last_price_timestamp?: string | null;
    pnl: number | null;
    sector?: string; // optional if you track a sector for each stock
  };
  

  type PercentageOverviewItem = {
    labelKey: string;
    percentage: number;
  };
  

  interface AnalysisResult {
    numberOfAssets: number;
    unrealizedGainLoss: number;
    totalInvested: number;
    topGainers: {
      name: string;
      gainPercentage: number;
      gainAmount: number;
    }[];
    topLosers: {
      name: string;
      gainPercentage: number;
      gainAmount: number;
    }[];
    assetTypeAllocation:  PercentageOverviewItem[];
    stockSectorAllocation: PercentageOverviewItem[];
  }


  




  
  export function computeAllocations(valid: PortfolioItem[]): {
    assetTypeAllocation: PercentageOverviewItem[];
    stockSectorAllocation: PercentageOverviewItem[];
  } {
    const typeValueMap: Record<string, number> = {};
    const sectorValueMap: Record<string, number> = {};
    let totalValue = 0;
    let stockValueTotal = 0;
  
    valid.forEach((item) => {
      const mv = item.quantity * (item.last_price ?? 0);
      totalValue += mv;
  
      // Asset Type Allocation
      if (!typeValueMap[item.asset_type]) {
        typeValueMap[item.asset_type] = 0;
      }
      typeValueMap[item.asset_type] += mv;
  
      // Stock Sector Allocation
      if (item.asset_type === "stock") {
        stockValueTotal += mv;
        const sector = item.sector ?? "Unknown";
        if (!sectorValueMap[sector]) {
          sectorValueMap[sector] = 0;
        }
        sectorValueMap[sector] += mv;
      }
    });
  
    const assetTypeAllocation: PercentageOverviewItem[] =
      totalValue > 0
        ? Object.entries(typeValueMap).map(([type, val]) => ({
            labelKey: type,
            percentage: parseFloat(((val / totalValue) * 100).toFixed(2)),
          }))
        : [];
  
    const stockSectorAllocation: PercentageOverviewItem[] =
      stockValueTotal > 0
        ? Object.entries(sectorValueMap).map(([sector, val]) => ({
            labelKey: sector,
            percentage: parseFloat(((val / stockValueTotal) * 100).toFixed(2)),
          }))
        : [];
  
    return {
      assetTypeAllocation,
      stockSectorAllocation,
    };
  }

  
  
  /**
   * analyzePortfolio: 
   * Returns an object with the requested fields.
   */

  export function analyzePortfolio(portfolio: PortfolioItem[]): AnalysisResult {
    // 1) Filter out items with no quantity or no last_price
    const valid = portfolio.filter(
      (item) => item.quantity > 0 && item.last_price !== null
    );
  
    // 2) Number of Assets
    const numberOfAssets = valid.length;
  
    // 3) totalInvested => sum of (avg_price * quantity)
    let totalInvested = 0;
    // 4) totalUnrealized => sum( (last_price - avg_price) * quantity )
    let unrealizedGainLoss = 0;
  
    // For gain sorting
    type GainEntry = {
      name: string;
      gainPercentage: number;
      gainAmount: number;
    };
    const gainList: GainEntry[] = [];
  
    valid.forEach((item) => {
      const invested = item.avg_price * item.quantity;
      totalInvested += invested;
  
      const priceNow = item.last_price ?? 0;
      const gainAmount = (priceNow - item.avg_price) * item.quantity;
      unrealizedGainLoss += gainAmount;
  
      const gainPercentage =
        item.avg_price > 0
          ? ((priceNow - item.avg_price) / item.avg_price) * 100
          : 0;
  
      gainList.push({
        name: item.name ?? item.ticker ?? "Unknown",
        gainPercentage,
        gainAmount,
      });
    });
  
    // 5) Sort by gainAmount descending
    gainList.sort((a, b) => b.gainAmount - a.gainAmount);
  
    // top 3 gainers
    const topGainers = gainList.slice(0, 3);
  
    // top 3 losers => slice last 3 reversed
    // (since sorted desc, losers are at the bottom)
    const losersReversed = gainList.slice(-3).reverse();
    const topLosers = losersReversed;
  
    // 6) Asset Type Allocation
    // => sum of (quantity * last_price) per asset_type vs totalValue
    // let totalValue = 0;
    // const typeValueMap: Record<string, number> = {};
  
    // valid.forEach((item) => {
    //   const mv = item.quantity * (item.last_price ?? 0);
    //   totalValue += mv;
    //   if (!typeValueMap[item.asset_type]) {
    //     typeValueMap[item.asset_type] = 0;
    //   }
    //   typeValueMap[item.asset_type] += mv;
    // });
  
    // const assetTypeAllocation: Record<string, number> = {};
    // if (totalValue > 0) {
    //   Object.entries(typeValueMap).forEach(([type, val]) => {
    //     assetTypeAllocation[type] = parseFloat(((val / totalValue) * 100).toFixed(2));
    //   });
    // }
  
    // // 7) Stock Sector Allocation
    // // => only for asset_type === 'stock'
    // const sectorValueMap: Record<string, number> = {};
    // let stockValueTotal = 0;
  
    // valid
    //   .filter((item) => item.asset_type === "stock")
    //   .forEach((item) => {
    //     const mv = item.quantity * (item.last_price ?? 0);
    //     stockValueTotal += mv;
    //     const sector = item.sector ?? "Unknown";
    //     if (!sectorValueMap[sector]) {
    //       sectorValueMap[sector] = 0;
    //     }
    //     sectorValueMap[sector] += mv;
    //   });
  
    // const stockSectorAllocation: Record<string, number> = {};
    // if (stockValueTotal > 0) {
    //   for (const [sect, val] of Object.entries(sectorValueMap)) {
    //     stockSectorAllocation[sect] = parseFloat(((val / stockValueTotal) * 100).toFixed(2));
    //   }
    // }
  

    const { assetTypeAllocation, stockSectorAllocation } = computeAllocations(portfolio);


    return {
      numberOfAssets,
      unrealizedGainLoss: parseFloat(unrealizedGainLoss.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      topGainers: topGainers.map((g) => ({
        ...g,
        gainAmount: parseFloat(g.gainAmount.toFixed(2)),
        gainPercentage: parseFloat(g.gainPercentage.toFixed(2)),
      })),
      topLosers: topLosers.map((l) => ({
        ...l,
        gainAmount: parseFloat(l.gainAmount.toFixed(2)),
        gainPercentage: parseFloat(l.gainPercentage.toFixed(2)),
      })),
      assetTypeAllocation,
      stockSectorAllocation,
    };
  }
  