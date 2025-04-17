/*
You should do a service that does the following:

1. Move price_snaphot in its own folder.
2. Do the portfolio_gains service.
3. Be sure average price is computed in transactions
4. Compute these fields:
   - unrealized gain/loss
   - top performers
   - top losers
   - number of assets
   - assets type allocations
   - stocks sector allocation
5. Fetch the user cash to compute these fields:
   - beginning balance cash/invested
   - end balance cash/invested
6. Fetch the transaction history
7. With 5. compute:
   - number of transactions
   - realized gain/loss
   - last 5 transactions
8. Add a web search with latest market news
9. Package this info for AI to fed in prompt
10. Package the info for components to be displayed:
   - n. of transactions
   - realized gain/loss
   - unrealized gain/loss
   - beginning balance cash/invested
   - end balance cash/invested
11. Test sending info to ai and printing the rest of the data
12. Make chart with initial data and perlin noise
13. Finalize the component for portfolio summary.

First thing:
  STEP A:
- The portfolio, with the date and time at which stocks were bought.
  --> Compute gain and loss for each of them... by calling fetch latest price...

  STEP B compute:
  from which you can get:
  - Unrealized gain/loss
  - Top performers
  - Top losers
  - Number of assets
  - Asset type allocations
  - Stocks sector allocations


  STEP 3:
The transaction history is useful to compute:
  - Number of transactions.
  - Realized gain/loss
  - Last 5 transactions

  - Maybe search the web for latest news on market and add it to the response...

Give suggestions on distribution...

*/


/*

this for now is made using fake data...




You should return 2 values:

prompt_for_ai. (add the language of the user to answer in).

data_for_component. (add the language of the user to answer in).

Data_for_component can just be the list of assets from which you compute allotments, losers, winners and lists.
- the header information: 5 things...
- the chart data... which means that you have
  - list of assets
  - number of transactions
  - realized gains/loss
  - unrealized gains/loss
  - current_invested_balance
  - current_cash (fix value)

  and that's the difference between start and end balance
  you have end balance, since it is your thing,

*/

import { fake_portfolio } from "../../app/fake_data/portfolio";
import { fake_transaction_history } from "../../app/fake_data/history";
import { analyzeTransactionHistory } from "./extract_history_info_simple";
import { analyzePortfolio } from "./extract_portfolio_info_simple";

import { runTavilySearch } from "../tavily_search";

function generateAiPrompt(data: object, language:string): string {
const userLanguage = language == "en" ? "English" : "Arabic";
  return `
This is the user's portfolio account for the selected period.
Please analyze the data and provide a clear and thoughtful summary of the portfolio's performance.
Your response should include:

Key highlights about gains and losses

Observations on diversification, risk, or asset allocation

Suggestions for potential improvements or actions the user might consider
Avoid simply listing data. Instead, explain trends or standout points in plain language.
The response must be discursive and personalized, not technical.
Speak directly to the user as if advising them.
Respond in the user's language: ${userLanguage}

Data:
${JSON.stringify(data, null, 2)}
  `.trim();
}

export async function return_portfolio_overview_data(
  user_id: string,
  start_date: string,
  language: string
) {


  console.log("DATA ARRIVING TO BACKEND IS: ", start_date, language);
  const user_balance = 100000;
  const startDate = new Date("2023-01-01").valueOf(); // or 1672531200000

  const historyResults = analyzeTransactionHistory(fake_transaction_history, startDate);
  const portfolioResults = analyzePortfolio(fake_portfolio);

  const tavilyQuery ="latest financial market overview including stocks, crypto, ETFs, and TSX performance";
  const latestNews =  await runTavilySearch(tavilyQuery, 3, 0.9);
  // extract portfolio info returns
  // return {
  //   numberOfAssets,
  //   unrealizedGainLoss: parseFloat(unrealizedGainLoss.toFixed(2)),
  //   totalInvested: parseFloat(totalInvested.toFixed(2)),
  //   topGainers: topGainers.map((g) => ({
  //     ...g,
  //     gainAmount: parseFloat(g.gainAmount.toFixed(2)),
  //     gainPercentage: parseFloat(g.gainPercentage.toFixed(2)),
  //   })),
  //   topLosers: topLosers.map((l) => ({
  //     ...l,
  //     gainAmount: parseFloat(l.gainAmount.toFixed(2)),
  //     gainPercentage: parseFloat(l.gainPercentage.toFixed(2)),
  //   })),
  //   assetTypeAllocation,
  //   stockSectorAllocation,
  // };

  //extract history returns:
  // return {
  //   number_of_transactions,
  //   most_recent_transactions: mostRecent,
  //   realized_gains: realizedGains,
  // };


  const data_for_ai = {
    "Portfolio Overview": portfolioResults,
    "History Overview": historyResults,
    "Market News": latestNews.answer

  }

  const prompt_for_ai =  generateAiPrompt(data_for_ai,language);


  const returnData = {

    prompt_for_ai: prompt_for_ai,

    data_for_component: {
      number_of_transactions: historyResults.number_of_transactions,
      realized_gains: historyResults.realized_gains,
      user_balance: user_balance,
      start_date: start_date,
      history:fake_transaction_history,
      assets: fake_portfolio,
      unrealizedGainLoss: portfolioResults.unrealizedGainLoss,
      totalInvested:portfolioResults.totalInvested,
      assetTypeAllocation: portfolioResults.assetTypeAllocation,
      stockSectorAllocation: portfolioResults.stockSectorAllocation,
    }
  };

  console.log("return data is: ", returnData)
   
  return returnData
}


