
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


