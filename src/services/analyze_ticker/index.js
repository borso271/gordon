
import fetchFormatData from "../analysis/fetch_and_format_data/fetch_and_format_data.js";
import { getAnalystRatings } from "../database/fetch_analyst_ratings";
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
  console.log("🔍 analyze_ticker started with parameters:", parameters);

  const { ticker_symbol, asset_type, analysis_type, language } = parameters;

  try {
    // We always run the full analysis
    const formatResult = await fetchFormatData(ticker_symbol, asset_type);
    const ratings = await getAnalystRatings(ticker_symbol);
    const ticker_snapshot = await fetchTickerSnapshot(ticker_symbol, asset_type);

    // If format failed, exit gracefully
    if (!formatResult || formatResult.status === "failure" || !formatResult.data_for_ai) {
      console.warn(`⚠️ Failed to get valid data for ${ticker_symbol}.`);
      return {
        status: "failure",
        prompt_for_ai: `The data provider failed to fetch analysis data for ${ticker_symbol}, so you should call the function search_web instead. Please provide the user with relevant information based on web results in ${language}.`,
        data_for_component: {
          polygon_snapshot: ticker_snapshot ?? {},
          ratings: ratings ?? {},
          ticker_symbol,
          asset_type,
          latest_news: [],
        },
      };
    }

    // If success — continue
    const { id, name, data_for_ai } = formatResult;

    const newsQuery = `Latest News About ${name} ${asset_type}`;
    const latestNews = await exaSearch({
      query: newsQuery,
      type: "auto",
      category: "news",
      numResults: 5,
      text: false,
      include_summary: true,
      include_images: false,
    });

    const stringified_data = JSON.stringify(data_for_ai);

    const prompt = `You are a financial analyst. The user asked for an in-depth analysis of ${ticker_symbol} in ${language}.

- First, call the function **show_tickers_chart** to display the stock chart.
- Then, analyze this data: ${stringified_data}
- Use the function **show_financial_data** to present relevant financials.
- Your analysis should:
  - Highlight positives and negatives
  - Extract trends and insights
  - Conclude with an opinion on whether it's a good investment.`

    return {
      status: "success",
      prompt_for_ai: prompt,
      data_for_component: {
        polygon_snapshot: ticker_snapshot ?? {},
        ratings: ratings ?? {},
        ticker_symbol,
        asset_type,
        latest_news: latestNews.results,
      },
    };
  } catch (error) {
    console.error("❌ Error in analyze_ticker:", error);
    return {
      status: "failure",
      prompt_for_ai: `Something went wrong fetching data for ${ticker_symbol}. Call search_web and show results to the user in ${language}.`,
      data_for_component: {
        polygon_snapshot: {},
        ratings: {},
        ticker_symbol,
        asset_type,
        latest_news: [],
      },
    };
  } finally {
    console.log("✅ analyze_ticker completed.");
  }
}






// export async function analyze_ticker(parameters) {

//   console.log("analyze_ticker started with parameters:", parameters);
  
//   const { ticker_symbol, asset_type, analysis_type, language } = parameters;
  
//   try {

//   if (1==1 || analysis_type == "depth_analysis") {

//     const ratings = await getAnalystRatings(ticker_symbol);
//     const ticker_snapshot = await fetchTickerSnapshot(ticker_symbol, asset_type);
//     const { id, data_for_ai } = await fetchFormatData(ticker_symbol, asset_type);
//     const name = data_for_ai["Company Profile"].name;
   
//     const newsQuery = `Latest News About ${name} ${asset_type}`;

//     const latestNews = await exaSearch({
//       query: newsQuery,
//      type:"auto",
//     category: "news",
//     numResults: 5,
//     text: false,
//     include_summary:true,
//     include_images:false
//     });
    
//     //const chart_data = await getSymbolOverviewData(ticker_symbol);
//     const stringified_data = JSON.stringify(data_for_ai);
//     const prompt = `This is ${ticker_symbol} financial data, to use for an in depth analysis, explains the positives, negatives of the ticker, and finally provide a conclusion.
//     Before this show the ticker chart to the user by calling the function show_tickers_chart. And as you illustrate the data, show it to the user by using: show_financial_data. The data is:  ${stringified_data}`;
   
//     const response = {
//         prompt_for_ai: prompt,
//         data_for_component: {
//         polygon_snapshot: ticker_snapshot,
//         ratings: ratings,
//         ticker_symbol: ticker_symbol,
//         asset_type: asset_type,
//         latest_news: latestNews.results}
      
//     };
//     return response;
// }

//   } catch (error) {
//     console.error("❌ Error in process_analysis:", error);
//     return { message: "Analysis failed", error: error.message || "Unknown error" };
//   } finally {
//     console.log("process_analysis completed.");
//   }
// }





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