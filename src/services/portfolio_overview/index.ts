
import { fake_portfolio } from "../../app/fake_data/portfolio";
import { fake_transaction_history } from "../../app/fake_data/history";
import { analyzeTransactionHistory } from "./extract_history_info_simple";
import { analyzePortfolio } from "./extract_portfolio_info_simple";
import { fetchBuyingPower } from "../get_buying_power";
import { runTavilySearch } from "../tavily_search";

function generateAiPrompt(data: object, language:string): string {
const userLanguage = language == "en" ? "English" : "Arabic";
  return `
You are a financial advisor reviewing a user's portfolio data.

Your task is to write a thoughtful and discursive overview of the user's performance, providing clear **insights**, **trends**, and **recommendations**. Avoid restating raw data. Focus on interpretation.

Here is how you should structure your response:

1. **Performance Overview**: Summarize gains or losses and comment on volatility or trends.
2. **Diversification & Allocation**: Comment on how the portfolio is distributed across sectors or assets. Is it balanced? Risky?
3. **Strengths & Weaknesses**: Highlight what is working well and what may need attention.
4. **Suggestions**: Offer tailored suggestions, such as rebalancing, exploring new sectors, or reducing exposure.
5. **Tone**: Be professional yet friendly, and speak directly to the user as if advising them.
6. **Language**: Write in the user’s language: ${userLanguage}.

Here is the user's portfolio data for your analysis:
${JSON.stringify(data, null, 2)}
  `.trim();
}

export async function return_portfolio_overview_data(
  user_id: string,
  start_date: string,
  language: string
) {

  const user_cash = await fetchBuyingPower("abc");
  const parsedDate = new Date(start_date);
  const isValidDate = !isNaN(parsedDate.getTime());

  const startDate = isValidDate ? parsedDate.valueOf() : new Date("2023-01-01").valueOf();


  const historyResults = analyzeTransactionHistory(fake_transaction_history, startDate);
  const portfolioResults = analyzePortfolio(fake_portfolio);

  const tavilyQuery ="latest financial market overview including stocks, crypto, ETFs, and TSX performance";
  const latestNews =  await runTavilySearch(tavilyQuery, 3, 0.9);
  
  const user_balance = (user_cash.cash ?? 0) + portfolioResults.totalInvested;

  const data_for_ai = {
    "Portfolio Overview": portfolioResults,
    "History Overview": historyResults,
    "Market News": latestNews.answer
  }

  const prompt_for_ai =  generateAiPrompt(data_for_ai,language);

  const returnData = {

    prompt_for_ai: prompt_for_ai,

    data_for_component: {
      user_cash: user_cash.cash,
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


