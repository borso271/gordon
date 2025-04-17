export function getTopPerformersAndLosers<T extends { avg_price: number; last_price: number }>(
    portfolio: T[]
  ): { top_performers: T[]; top_losers: T[] } {
    const withValidPrices = portfolio.filter(
      (item) =>
        typeof item.avg_price === "number" &&
        item.avg_price > 0 &&
        typeof item.last_price === "number"
    );
  
    const sortedByChange = [...withValidPrices].sort((a, b) => {
      const changeA = (a.last_price - a.avg_price) / a.avg_price;
      const changeB = (b.last_price - b.avg_price) / b.avg_price;
      return changeB - changeA;
    });
  
    const top_performers = sortedByChange.filter(item => item.last_price > item.avg_price).slice(0, 5);
    const top_losers = sortedByChange.filter(item => item.last_price < item.avg_price).reverse().slice(0, 5);
  
    return {
      top_performers,
      top_losers,
    };
  }
  