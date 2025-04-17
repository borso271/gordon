import supabase_client from "../../lib/supabaseClient";

interface RealizedTx {
    id: number;
    ticker: string;
    name: string;
    quantity: number;
    price_per_unit: number;
    transaction_date: string;
    realizedGain: number;
  }


interface TransactionRow {
    id: number;
    user_id: string;
    symbol_id: number;
    transaction_type: "buy" | "sell";
    quantity: number;
    price_per_unit: number;
    transaction_date: string;  // 'YYYY-MM-DD' or full ISO
    comment: string | null;
    symbols: {
      ticker: string;
      name: string;
    } | null;
  }
  
  interface RealizedResult {
    totalRealizedGain: number;
    topProfitable: RealizedTx[];
    topLosing: RealizedTx[];
    totalTransactions: number;  // total fetched transactions up to today
    countInRange: number;       // transactions that fell in [startDate, today]
  }
  
  export async function getRealizedGainsWeightedAverage(
    userId: string,
    startDate: string
  ): Promise<RealizedResult> {
    // 1) fetch all transactions from user, earliest to today
    const { data, error } = await supabase_client
      .from("transactions")
      .select(`
        id,
        user_id,
        symbol_id,
        transaction_type,
        quantity,
        price_per_unit,
        transaction_date,
        comment,
        symbols (
          ticker,
          name
        )
      `)
      .eq("user_id", userId)
      .order("transaction_date", { ascending: true })
      .order("id", { ascending: true }); // ensure stable ordering within same date
  
    if (error || !data) {
      console.error("❌ Error fetching transactions:", error);
      return {
        totalRealizedGain: 0,
        topProfitable: [],
        topLosing: [],
        totalTransactions: 0,
        countInRange: 0,
      };
    }
  
    // data up to the present
    const endDate = new Date().toISOString().slice(0, 10);
  
    // We'll store: [symbol_id]: { totalQuantity, totalCost }
    const portfolioMap: Record<number, { totalQuantity: number; totalCost: number }> = {};
  
    // This array will hold a record for each SELL to compute final sorting
    const realizedTxList: RealizedTx[] = [];
  
    // 1) Convert data to typed array
    const typedData = data as unknown as TransactionRow[];
  

for (const row of typedData) {

    // track how many transactions fall in [startDate, endDate] (any type)
    let countInRange = 0;
  
    for (const row of typedData) {
      const txDate = row.transaction_date.slice(0, 10); // 'YYYY-MM-DD'
      const dateObj = new Date(txDate);
      const dateValue = dateObj.valueOf(); // ms since epoch
      const startValue = new Date(startDate).valueOf();
      const endValue = new Date(endDate).valueOf();
  
      // if the transaction_date is within the requested range, increment
      if (dateValue >= startValue && dateValue <= endValue) {
        countInRange++;
      }
  
      // parse quantity & price
      const qty = parseFloat(String(row.quantity));
      const px = parseFloat(String(row.price_per_unit));
  
      // ensure symbol in portfolioMap
      if (!portfolioMap[row.symbol_id]) {
        portfolioMap[row.symbol_id] = {
          totalQuantity: 0,
          totalCost: 0,
        };
      }
  
      const portfolio = portfolioMap[row.symbol_id];
  
      if (row.transaction_type === "buy") {
        // Weighted-average addition
        portfolio.totalCost += qty * px;
        portfolio.totalQuantity += qty;
      } else if (row.transaction_type === "sell") {
        if (portfolio.totalQuantity <= 0) {
          console.warn("SELL with no shares in cost basis. Possibly negative??");
          continue;
        }
  
        // compute average cost
        const avgCost = portfolio.totalCost / portfolio.totalQuantity;
        // realized gain for this SELL
        const realizedGain = qty * (px - avgCost);
  
        // only track in final results if this SELL is >= start_date
        if (dateValue >= startValue && dateValue <= endValue) {
          realizedTxList.push({
            id: row.id,
            ticker: row.symbols?.ticker ?? "",
            name: row.symbols?.name ?? "",
            quantity: qty,
            price_per_unit: px,
            transaction_date: txDate,
            realizedGain,
          });
        }
  
        // update cost basis
        const costPortion = avgCost * qty;
        portfolio.totalCost -= costPortion;
        portfolio.totalQuantity -= qty;
        if (portfolio.totalQuantity < 0) {
          portfolio.totalQuantity = 0;
          portfolio.totalCost = 0; 
        }
      }
    }
  
    // 2) Summation
    const totalRealizedGain = realizedTxList.reduce((sum, tx) => sum + tx.realizedGain, 0);
  
    // 3) separate out profitable vs losing
    const winners = realizedTxList.filter((tx) => tx.realizedGain > 0);
    const losers = realizedTxList.filter((tx) => tx.realizedGain < 0);
  
    // sort descending by realizedGain
    winners.sort((a, b) => b.realizedGain - a.realizedGain);
    // sort ascending by realizedGain
    losers.sort((a, b) => a.realizedGain - b.realizedGain);
  
    const topProfitable = winners.slice(0, 3);
    const topLosing = losers.slice(0, 3);
  
    return {
      totalRealizedGain,
      topProfitable,
      topLosing,
      totalTransactions: typedData.length,
      countInRange,
    };
  }
}
  