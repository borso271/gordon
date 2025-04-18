import { Transaction } from "../../interfaces"
export const fake_transaction_history: Transaction[] = [
    
    {
      "id": 2,
      "ticker": "VOO",
      "name": "Vanguard S&P 500 ETF",
      "date": 1672531200000, // Changed to string to match portfolio data
      "type": "Buy",
      "asset_type": "etf", // Added
      "quantity": 50,
      "price": 450.00,
      "status": "confirmed"
    },
    {
      "id": 3,
      "ticker": "SPY",
      "name": "SPDR S&P 500 ETF Trust",
      "date": 1672531200000, // Changed to string
      "type": "Buy",
      "asset_type": "etf", // Added
      "quantity": 30,
      "price": 480.00,
         "status": "confirmed"
    },
    {
      "id": 4,
      "ticker": "GOOGL",
      "name": "Alphabet Inc. (Class A)",
      "date": 1673788800000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 15,
      "price": 130.00,
         "status": "confirmed"
    },
    {
      "id": 5,
      "ticker": "QQQ",
      "name": "Invesco QQQ Trust",
      "date": 1675209600000, // Changed to string
      "type": "Buy",
      "asset_type": "etf", // Added
      "quantity": 40,
      "price": 390.00,
         "status": "canceled"
    },
    {
      "id": 6,
      "ticker": "JNJ",
      "name": "Johnson & Johnson",
      "date": 1677628800000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 75,
      "price": 150.00,
       "status": "confirmed"
    },
    {
      "id": 7,
      "ticker": "GOOGL",
      "name": "Alphabet Inc. (Class A)",
      "date": 1679270400000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 10,
      "price": 142.90,
       "status": "confirmed"
    },
    {
      "id": 8,
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "date": 1678886400000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 30,
      "price": 150.00,
      "status": "canceled"
    },
    {
      "id": 9,
      "ticker": "MSFT",
      "name": "Microsoft Corporation",
      "date": 1681478400000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 30,
      "price": 380.50,
       "status": "confirmed"
    },
    {
      "id": 11,
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "date": 1683676800000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 20,
      "price": 164.375,
       "status": "confirmed"
    },
    {
      "id": 12,
      "ticker": "JPM",
      "name": "JPMorgan Chase & Co.",
      "date": 1684080000000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 60,
      "price": 170.10,
       "status": "confirmed"
    },
    {
      "id": 13,
      "ticker": "V",
      "name": "Visa Inc.",
      "date": 1686739200000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 55,
      "price": 250.25,
       "status": "confirmed"
    },
    {
      "id": 14,
      "ticker": "PG",
      "name": "Procter & Gamble Company",
      "date": 1688169600000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 80,
      "price": 160.00,
       "status": "confirmed"
    },
    {
      "id": 15,
      "ticker": "TSLA",
      "name": "Tesla, Inc.",
      "date": 1689331200000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 20,
      "price": 205.00,
       "status": "confirmed"
    },
    {
      "id": 16,
      "ticker": "WMT",
      "name": "Walmart Inc.",
      "date": 1690848000000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 100,
      "price": 55.00,
       "status": "confirmed"
    },
    {
      "id": 17,
      "ticker": "TSLA",
      "name": "Tesla, Inc.",
      "date": 1692057600000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 15,
      "price": 216.67,
       "status": "confirmed"
    },
    
    {
      "id": 19,
      "ticker": "AMZN",
      "name": "Amazon.com, Inc.",
      "date": 1693574400000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 40,
      "price": 140.00,
       "status": "confirmed"
    },
    {
      "id": 20,
      "ticker": "UNH",
      "name": "UnitedHealth Group Incorporated",
      "date": 1694784000000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 15,
      "price": 510.00,
       "status": "canceled"
    },
    {
      "id": 21,
      "ticker": "META",
      "name": "Meta Platforms, Inc.",
      "date": 1696166400000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 20,
      "price": 350.80,
       "status": "confirmed"
    },
    {
      "id": 22,
      "ticker": "BTCUSD",
      "name": "Bitcoin",
      "date": 1698844800000, // Changed to string
      "type": "Buy",
      "asset_type": "crypto", // Added
      "quantity": 0.05,
      "price": 45000.00,
       "status": "confirmed"
    },
    {
      "id": 23,
      "ticker": "ETHUSD",
      "name": "Ethereum",
      "date": 1701388800000, // Changed to string
      "type": "Buy",
      "asset_type": "crypto", // Added
      "quantity": 1.0,
      "price": 2700.00,
       "status": "confirmed"
    },
    {
      "id": 24,
      "ticker": "NVDA",
      "name": "NVIDIA Corporation",
      "date": 1704067200000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 15,
      "price": 750.00,
       "status": "confirmed"
    },
    {
      "id": 26,
      "ticker": "ETHUSD",
      "name": "Ethereum",
      "date": 1704844800000, // Changed to string
      "type": "Buy",
      "asset_type": "crypto", // Added
      "quantity": 0.5,
      "price": 3000.00,
       "status": "confirmed"
    },
    {
      "id": 27,
      "ticker": "BRK-B",
      "name": "Berkshire Hathaway Inc. (Class B)",
      "date": 1706745600000, // Changed to string
      "type": "Buy",
      "asset_type": "stock", // Added
      "quantity": 25,
      "price": 385.50,
       "status": "confirmed"
    },
    {
      "id": 28,
      "ticker": "SOL",
      "name": "Solana",
      "date": 1709251200000, // Changed to string
      "type": "Buy",
      "asset_type": "crypto", // Added
      "quantity": 25,
      "price": 100.00,
       "status": "confirmed"
    }
  ]



// export const fake_transaction_history = [
//     {
//       "id": 2,
//       "ticker": "VOO",
//       "name": "Vanguard S&P 500 ETF",
//       "date": 1672531200000, 
//       "type": "Buy",
//       "quantity": 50,
//       "price": 450.00 
//     },
//     {
//       "id": 3,
//       "ticker": "SPY",
//       "name": "SPDR S&P 500 ETF Trust",
//       "date": 1672531200000, // Matches SPY first_acquired
//       "type": "Buy",
//       "quantity": 30,
//       "price": 480.00 // Matches SPY avg_price
//     },
//     {
//       "id": 4,
//       "ticker": "GOOGL",
//       "name": "Alphabet Inc. (Class A)",
//       "date": 1673788800000, // Matches GOOGL first_acquired
//       "type": "Buy",
//       "quantity": 15,
//       "price": 130.00 // Part 1 for GOOGL avg price
//     },
//     {
//       "id": 5,
//       "ticker": "QQQ",
//       "name": "Invesco QQQ Trust",
//       "date":1675209600000, // Matches QQQ first_acquired
//       "type": "Buy",
//       "quantity": 40,
//       "price": 390.00 // Matches QQQ avg_price
//     },
//     {
//       "id": 6,
//       "ticker": "JNJ",
//       "name": "Johnson & Johnson",
//       "date": 1677628800000, // Matches JNJ first_acquired
//       "type": "Buy",
//       "quantity": 75,
//       "price": 150.00 // Matches JNJ avg_price
//     },
//      {
//       "id": 7,
//       "ticker": "GOOGL",
//       "name": "Alphabet Inc. (Class A)",
//       "date": 1679270400000, // March 20, 2023
//       "type": "Buy",
//       "quantity": 10,
//       "price": 142.90 // Part 2 for GOOGL avg price -> (15*130 + 10*142.9)/25 = 135.16 (close)
//     },
//     {
//       "id": 8,
//       "ticker": "AAPL",
//       "name": "Apple Inc.",
//       "date": 1678886400000, // Matches AAPL first_acquired
//       "type": "Buy",
//       "quantity": 30,
//       "price": 150.00 // Part 1 for AAPL avg price
//     },
//     {
//       "id": 9,
//       "ticker": "MSFT",
//       "name": "Microsoft Corporation",
//       "date": 1681478400000, // Matches MSFT first_acquired
//       "type": "Buy",
//       "quantity": 30,
//       "price": 380.50 // Matches MSFT avg_price
//     },
//      {
//       "id": 11,
//       "ticker": "AAPL",
//       "name": "Apple Inc.",
//       "date": 1683676800000, // May 10, 2023
//       "type": "Buy",
//       "quantity": 20,
//       "price": 164.375 // Part 2 for AAPL avg price -> (30*150 + 20*164.375)/50 = 155.75
//     },
//     {
//       "id": 12,
//       "ticker": "JPM",
//       "name": "JPMorgan Chase & Co.",
//       "date": 1684080000000, // Matches JPM first_acquired
//       "type": "Buy",
//       "quantity": 60,
//       "price": 170.10 // Matches JPM avg_price
//     },
//     {
//       "id": 13,
//       "ticker": "V",
//       "name": "Visa Inc.",
//       "date": 1686739200000, // Matches V first_acquired
//       "type": "Buy",
//       "quantity": 55,
//       "price": 250.25 // Matches V avg_price
//     },
//      {
//       "id": 14,
//       "ticker": "PG",
//       "name": "Procter & Gamble Company",
//       "date": 1688169600000, // Matches PG first_acquired
//       "type": "Buy",
//       "quantity": 80,
//       "price": 160.00 // Matches PG avg_price
//     },
//     {
//       "id": 15,
//       "ticker": "TSLA",
//       "name": "Tesla, Inc.",
//       "date": 1689331200000, // Matches TSLA first_acquired
//       "type": "Buy",
//       "quantity": 20,
//       "price": 205.00 // Part 1 for TSLA avg price
//     },
//       {
//       "id": 16,
//       "ticker": "WMT",
//       "name": "Walmart Inc.",
//       "date": 1690848000000, // Matches WMT first_acquired
//       "type": "Buy",
//       "quantity": 100,
//       "price": 55.00 // Matches WMT avg_price (assuming post-split basis)
//     },
//     {
//       "id": 17,
//       "ticker": "TSLA",
//       "name": "Tesla, Inc.",
//       "date": 1692057600000, // Aug 15, 2023
//       "type": "Buy",
//       "quantity": 15,
//       "price": 216.67 // Part 2 for TSLA avg price -> (20*205 + 15*216.67)/35 = 210.00 (approx)
//     },
//     {
//       "id": 18,
//       "ticker": "AAPL", // Example Dividend
//       "name": "Apple Inc.",
//       "date": 1692230400000, // Aug 17, 2023
//       "type": "Dividend",
//       "quantity": 24.50, // e.g., $0.49/share for 50 shares
//       "price": null
//     },
//     {
//       "id": 19,
//       "ticker": "AMZN",
//       "name": "Amazon.com, Inc.",
//       "date": 1693574400000, // Matches AMZN first_acquired
//       "type": "Buy",
//       "quantity": 40,
//       "price": 140.00 // Matches AMZN avg_price
//     },
//     {
//       "id": 20,
//       "ticker": "UNH",
//       "name": "UnitedHealth Group Incorporated",
//       "date": 1694784000000, // Matches UNH first_acquired
//       "type": "Buy",
//       "quantity": 15,
//       "price": 510.00 // Matches UNH avg_price
//     },
//      {
//       "id": 21,
//       "ticker": "META",
//       "name": "Meta Platforms, Inc.",
//       "date": 1696166400000, // Matches META first_acquired
//       "type": "Buy",
//       "quantity": 20,
//       "price": 350.80 // Matches META avg_price
//     },
//     {
//       "id": 22,
//       "ticker": "BTCUSD",
//       "name": "Bitcoin",
//       "date": 1698844800000, // Matches BTCUSD first_acquired
//       "type": "Buy",
//       "quantity": 0.05,
//       "price": 45000.00 // Matches BTCUSD avg_price
//     },
//      {
//       "id": 23,
//       "ticker": "ETHUSD",
//       "name": "Ethereum",
//       "date": 1701388800000, // Matches ETHUSD first_acquired
//       "type": "Buy",
//       "quantity": 1.0,
//       "price": 2700.00 // Part 1 for ETHUSD avg price
//     },
//     {
//       "id": 24,
//       "ticker": "NVDA",
//       "name": "NVIDIA Corporation",
//       "date": 1704067200000, // Matches NVDA first_acquired
//       "type": "Buy",
//       "quantity": 15,
//       "price": 750.00 // Matches NVDA avg_price (assuming pre-split basis for mock simplicity)
//     },
//       {
//       "id": 26,
//       "ticker": "ETHUSD",
//       "name": "Ethereum",
//       "date": 1704844800000, // Jan 10, 2024
//       "type": "Buy",
//       "quantity": 0.5,
//       "price": 3000.00 // Part 2 for ETHUSD avg price -> (1*2700 + 0.5*3000)/1.5 = 2800.00
//     },
//     {
//       "id": 27,
//       "ticker": "BRK-B",
//       "name": "Berkshire Hathaway Inc. (Class B)",
//       "date": 1706745600000, // Matches BRK-B first_acquired
//       "type": "Buy",
//       "quantity": 25,
//       "price": 385.50 // Matches BRK-B avg_price
//     },
//     {
//       "id": 28,
//       "ticker": "SOL",
//       "name": "Solana",
//       "date": 1709251200000, // Matches SOL first_acquired
//       "type": "Buy",
//       "quantity": 25,
//       "price": 100.00 // Matches SOL avg_price
//     }
//   ]