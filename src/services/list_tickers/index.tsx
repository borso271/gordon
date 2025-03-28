import { fetchSymbolSnapshots } from "../database/fetch_symbols_for_list";

export async function list_tickers(args) {
    console.log("ARGS ARRIVING TO THE BACKEND ARE: ", args)
  const { asset_type, sectors = [], sort_by } = args;

  try {
    const snapshots = await fetchSymbolSnapshots(asset_type, sectors);

    if (!snapshots || snapshots.length === 0) {
      return {
        success: false,
        response: []
      };
    }

    const sorted = snapshots
      .filter(s => s.price != null && s.volume != null)
      .sort((a, b) => {
        if (sort_by === 'volume') return Number(b.volume) - Number(a.volume);
        return Number(b.price) - Number(a.price);
      })
      .slice(0, 20);
       
      console.log("SORTED ARE: ", sorted)
    return {
      success: true,
      response: sorted.map(s => ({
        name: s.name,
        ticker: s.ticker,
        ytd_return: s.ytd_return != null ? `${s.ytd_return.toFixed(2)}%` : null,
        ytd_range: s.ytd_range,
        price: s.price != null ? `$${s.price.toFixed(2)}` : null
      }))
    };
  } catch (error) {
    console.error("❌ Error in list_tickers:", error.message);
    return {
      success: false,
      response: []
    };
  }
}


// export async function list_tickers(args: any) {
//     const failed = false;
//     if (failed)
// {    return {
//         success: false,
//         response: []
//     }}
//     else { 
//     return  {
//         success: true,
//         response: [
//         {
//           name: "Apple Inc.",
//           ticker: "AAPL",
//           ytd_return: "12.5%",
//           ytd_range: "145.32 - 197.46",
//           price: "$189.25",
//         },
//         {
//           name: "Toyota Motor Corp.",
//           ticker: "TM",
//           country: "Japan",
//           ytd_return: "8.2%",
//           ytd_range: "130.50 - 165.75",
//           price: "$162.10",
//         },
//         {
//           name: "Nestlé S.A.",
//           ticker: "NSRGY",
//           country: "Switzerland",
//           ytd_return: "3.9%",
//           ytd_range: "114.00 - 125.90",
//           price: "$120.50",
//         },
//         {
//           name: "Samsung Electronics",
//           ticker: "005930.KS",
//           country: "South Korea",
//           ytd_return: "18.4%",
//           ytd_range: "54,300 - 71,800",
//           price: "69,400₩",
//         },
//         {
//           name: "Alibaba Group",
//           ticker: "BABA",
//           country: "China",
//           ytd_return: "-4.7%",
//           ytd_range: "65.00 - 102.30",
//           price: "$72.15",
//         },
//         {
//           name: "LVMH Moët Hennessy",
//           ticker: "MC.PA",
//           country: "France",
//           ytd_return: "9.1%",
//           ytd_range: "694.10 - 824.50",
//           price: "€802.30",
//         },
//         {
//           name: "Roche Holding AG",
//           ticker: "ROG.SW",
//           country: "Switzerland",
//           ytd_return: "1.6%",
//           ytd_range: "230.00 - 256.80",
//           price: "CHF 243.70",
//         },
//         {
//           name: "Infosys Ltd.",
//           ticker: "INFY",
//           country: "India",
//           ytd_return: "6.3%",
//           ytd_range: "15.20 - 19.80",
//           price: "$18.45",
//         },
//         {
//           name: "Banco Santander",
//           ticker: "SAN",
//           country: "Spain",
//           ytd_return: "11.0%",
//           ytd_range: "3.10 - 4.35",
//           price: "$4.20",
//         },
//         {
//           name: "BHP Group Limited",
//           ticker: "BHP",
//           country: "Australia",
//           ytd_return: "7.7%",
//           ytd_range: "55.60 - 67.90",
//           price: "$66.25",
//         },
//       ]}
//     }
//   }
  