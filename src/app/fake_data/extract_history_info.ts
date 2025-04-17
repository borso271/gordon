export interface TransactionItem {
    id: number;
    ticker: string;
    name: string;
    date: number;     // in ms from epoch
    type: string;
    quantity: number;   // quantity
    price: number;    // price per share
  }
  
  interface HistoryAnalysisResult {
    number_of_transactions: number;
    most_recent_transactions: {
      ticker: string;
      name: string;
      date: number;
      price: number;
      quantity: number;
    }[];
    realized_gains: number; // sum of all SELLs from Weighted Average
  }
  
  /**
   * Analyzes the transaction history from `startDate` to now.
   * Weighted-Average method for realized gains on SELL transactions.
   */

  export function analyzeTransactionHistory(
    list: TransactionItem[],
    startDate: number
  ): HistoryAnalysisResult {
    // 1. Filter transactions from `startDate` to now
    const now = Date.now(); // or your own cutoff if needed
    const filtered = list.filter(
      (tx) => tx.date >= startDate && tx.date <= now
    );
  
    // 2. Sort them by date ascending for cost-basis calculation
    filtered.sort((a, b) => a.date - b.date);
  
    // We’ll store cost basis in memory:
    // Key = ticker, value = { quantity, totalCost }
    const portfolioMap: Record<
      string,
      { quantity: number; totalCost: number }
    > = {};
  
    let realizedGains = 0;
  
    // Weighted-Average Cost approach
    for (const tx of filtered) {
      const key = tx.ticker; // or use ticker+some-other-identifier if needed
      if (!portfolioMap[key]) {
        portfolioMap[key] = { quantity: 0, totalCost: 0 };
      }
  
      const position = portfolioMap[key];
      if (tx.type === "Buy") {
        // Weighted-average addition
        // totalCost += quantity * price
        // quantity += quantity
        position.totalCost += tx.quantity * tx.price;
        position.quantity += tx.quantity;
      } else if (tx.type === "Sell") {
        // If there's no quantity, skip or treat as negative
        if (position.quantity <= 0) {
          console.warn(`SELL of ${tx.ticker} but 0 in portfolio? Skipping.`);
          continue;
        }
  
        // Weighted-average cost
        const avgCost = position.totalCost / position.quantity;
  
        // realized = (sellPrice - avgCost) * sellQty
        const realized = (tx.price - avgCost) * tx.quantity;
        realizedGains += realized;
  
        // Now reduce the position
        // cost portion = avgCost * sellQty
        const costPortion = avgCost * tx.quantity;
        position.totalCost -= costPortion;
        position.quantity -= tx.quantity;
        if (position.quantity < 0) {
          position.quantity = 0;
          position.totalCost = 0;
        }
      }
    }
  
    // 3. Number of transactions
    const number_of_transactions = filtered.length;
  
    // 4. Most recent transactions (limit 3)
    // sort descending by date, pick top 3
    const mostRecent = [...filtered]
      .sort((a, b) => b.date - a.date)
      .slice(0, 3)
      .map((tx) => ({
        ticker: tx.ticker,
        name: tx.name,
        date: tx.date,
        price: tx.price,
        quantity: tx.quantity,
      }));
  
    return {
      number_of_transactions,
      most_recent_transactions: mostRecent,
      realized_gains: realizedGains,
    };
  }
  