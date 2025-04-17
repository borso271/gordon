
import fetchFormatData from "../analysis/fetch_and_format_data/fetch_and_format_data.js";
import { getAnalystRatings } from "../database/fetch_analyst_ratings";
import { getSymbolOverviewData } from "./chart_data";
import { fetchTickerSnapshot } from "./polygon_ticker";
import { exaSearch } from "../exa_search";
/**
 * Processes stock analysis:
 * 1. Fetches stock data.
 * 2. Gets AI analysis.
 * 3. **Returns AI response immediately**.
 * 4. Saves analysis to the database **in the background**.
 *
 * @param {Object} parameters - Request parameters
 * @returns {Object} - AI response
 */

// import { getTickerName } from "./get_ticker_name.js";

export async function analyze_ticker(parameters) {

  // You have two options here: overview and in depth...
  // return the data to GPT, and the TWO DIFFERENT PROMPS
  console.log("analyze_ticker started with parameters:", parameters);
  
  const { ticker_symbol, asset_type, analysis_type, language } = parameters;
  
  try {

  if (1==1 || analysis_type == "depth_analysis") {

    const ratings = await getAnalystRatings(ticker_symbol);
    const ticker_snapshot = await fetchTickerSnapshot(ticker_symbol, asset_type);
    const { id, data_for_ai } = await fetchFormatData(ticker_symbol, asset_type);
    const name = data_for_ai["Company Profile"].name;
   
    const newsQuery = `Latest News About ${name} ${asset_type}`;

    const latestNews = await exaSearch({
      query: newsQuery,
     type:"auto",
    category: "news",
    numResults: 5,
    text: false,
    include_summary:true,
    include_images:false
    });
    
    //const chart_data = await getSymbolOverviewData(ticker_symbol);
    const stringified_data = JSON.stringify(data_for_ai);
    const prompt = `This is ${ticker_symbol} financial data, to use for an in depth analysis, explains the positives, negatives of the ticker, and finally provide a conclusion.
    Before this show the ticker chart to the user by calling the function show_tickers_chart. And as you illustrate the data, show it to the user by using: show_financial_data. The data is:  ${stringified_data}`;
   
    const response = {
        prompt_for_ai: prompt,
        data_for_component: {
        polygon_snapshot: ticker_snapshot,
        ratings: ratings,
        ticker_symbol: ticker_symbol,
        asset_type: asset_type,
        latest_news: latestNews.results}
      
    };
    return response;
}

  } catch (error) {
    console.error("❌ Error in process_analysis:", error);
    return { message: "Analysis failed", error: error.message || "Unknown error" };
  } finally {
    console.log("process_analysis completed.");
  }
}

/* Ratings and News Should be Returned for the tables from here and not called inside the component.


const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"query":"who is Leo Messi?","topic":"general","search_depth":"basic","chunks_per_source":3,"max_results":1,"time_range":null,"days":7,"include_answer":true,"include_raw_content":false,"include_images":false,"include_image_descriptions":false,"include_domains":[],"exclude_domains":[]}'
};

fetch('https://api.tavily.com/search', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));




  For Analysis:

  do all without news,
  add chart...
  add news...

*/