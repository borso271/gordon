type Transaction = {
    id: number;
    ticker: string;
    name: string;
    asset_type: "stock" | "crypto" | "etf";
    date: number;
    type: "Buy" | "Sell";
    quantity: number;
    price: number;
  };
  
  export function filterTransactionsByAssetType(
    transactions: Transaction[],
    assetType: string
  ): Transaction[] {
    return transactions.filter((t) => t.asset_type === assetType);
  }
  