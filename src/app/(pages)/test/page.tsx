"use client"

import React from 'react';
// import LlamaQuery from '../../../components/LlamaQuery/LlamaQuery';

import styles from './test.module.css'
import CustomComparisonChart from '../../../components/DataDriven/ComparisonChart';
import TestCompareAPI from '../../../components/tests/test_compare_api';

import AssetsWithInsight from '../../../components/AssetsWithInsight';
import TestExaSearch from '../../../components/tests/test_exa_seach';
import ReadingIndicator from '../../../components/SpeakingAnimation';
import { generatePriceSeriesPerlin } from '../../../utils/generate_chart_points';
import { generatePriceSeriesPivots } from '../../../utils/generate_chart_points_pivots';
import Loading from '../../../components/Loading';

import DropdownSelect from '../../../components/Dropdowns/DropdownSelect';
import CompareTest from '../../../components/tests/compare_picker';
import PickPair from '../../sections/comparison/PickPair';
import KnowledgeFolderList from '../../sections/knowledge_center/KnowledgeCenter/components/KnowledgeFolderList';
import KnowledgeItemList from '../../sections/knowledge_center/KnowledgeCenter/components/KnowledgeItemList';
interface RawDataEntry {
  ticker: string;
  data: {
    [metricName: string]: {
      value?: string;
      one_quarter_trend?: string;
      one_year_trend?: string;
    };
  };
}


const dataForComparisonTable = [
  {
    "ticker": "AAPL",
   

      "data": {
      
          "Assets": {
            "value": "344 Billion",
            "one_quarter_trend": "-5.72%",
            "one_year_trend": "-2.67%"
          },
          "Current Assets": {
            "value": "133 Billion",
            "one_quarter_trend": "-12.91%",
            "one_year_trend": "-7.27%"
          },
          "Inventory": {
            "value": "7 Billion",
            "one_quarter_trend": "-5.15%",
            "one_year_trend": "6.14%"
          },
          "Fixed Assets": {
            "value": "46 Billion",
            "one_quarter_trend": "0.85%",
            "one_year_trend": "5.50%"
          },
          "Liabilities": {
            "value": "277 Billion",
            "one_quarter_trend": "-9.97%",
            "one_year_trend": "-0.75%"
          },
          "Current Liabilities": {
            "value": "144 Billion",
            "one_quarter_trend": "-18.16%",
            "one_year_trend": "7.76%"
          },
          "Accounts Payable": {
            "value": "62 Billion",
            "one_quarter_trend": "-10.22%",
            "one_year_trend": "6.47%"
          },
          "Long-term Debt": {
            "value": "95 Billion",
            "one_quarter_trend": "-1.93%",
            "one_year_trend": "-10.57%"
          },
          "Equity": {
            "value": "67 Billion",
            "one_quarter_trend": "17.22%",
            "one_year_trend": "-9.91%"
          }
       
        
      }
    },
  {
    
    "ticker": "TSLA",
    "data": {
       
          "Assets": {
            "value": "122 Billion",
            "one_quarter_trend": "1.85%",
            "one_year_trend": "14.49%"
          },
          "Current Assets": {
            "value": "58 Billion",
            "one_quarter_trend": "3.51%",
            "one_year_trend": "17.62%"
          },
          "Inventory": {
            "value": "12 Billion",
            "one_quarter_trend": "-17.30%",
            "one_year_trend": "-11.81%"
          },
          "Fixed Assets": {
            "value": "36 Billion",
            "one_quarter_trend": "-0.78%",
            "one_year_trend": "20.56%"
          },
          "Intangible Assets": {
            "value": "150 Million",
            "one_quarter_trend": "-5.06%",
            "one_year_trend": "-15.73%"
          },
          "Liabilities": {
            "value": "48 Billion",
            "one_quarter_trend": "-1.53%",
            "one_year_trend": "12.51%"
          },
          "Current Liabilities": {
            "value": "29 Billion",
            "one_quarter_trend": "-5.74%",
            "one_year_trend": "0.25%"
          },
          "Accounts Payable": {
            "value": "12 Billion",
            "one_quarter_trend": "-14.88%",
            "one_year_trend": "-13.56%"
          },
          "Long-term Debt": {
            "value": "6 Billion",
            "one_quarter_trend": "4.93%",
            "one_year_trend": "106.38%"
          },
          "Equity": {
            "value": "74 Billion",
            "one_quarter_trend": "4.21%",
            "one_year_trend": "16.18%"
          }
       
        
      }
    }
  
]

import MetricComparison from '../../sections/comparison/components/MetricComparison';
const portfolioData = {
  start_date: "2024-01-01",
  assets: [
    {
      id: 1,
      ticker: "AAPL",
      name: "Apple Inc.",
      asset_type: "stocks",
      price: 187.45,
      start_value: 150.00,
      start_date: "2024-01-01",
    },
    {
      id: 2,
      ticker: "MSFT",
      name: "Microsoft Corp.",
      asset_type: "stocks",
      price: 315.22,
      start_value: 290.00,
      start_date: "2024-01-01",
    },
    {
      id: 3,
      ticker: "BTC",
      name: "Bitcoin",
      asset_type: "crypto",
      price: 62750.55,
      start_value: 49000.00,
      start_date: "2024-01-01",
    },
    {
      id: 4,
      ticker: "ETH",
      name: "Ethereum",
      asset_type: "crypto",
      price: 3190.25,
      start_value: 2700.00,
      start_date: "2024-01-01",
    },
    {
      id: 5,
      ticker: "VOO",
      name: "Vanguard S&P 500 ETF",
      asset_type: "etf",
      price: 420.88,
      start_value: 400.00,
      start_date: "2024-01-01",
    },
    {
      id: 6,
      ticker: "QQQ",
      name: "Invesco QQQ Trust",
      asset_type: "etf",
      price: 370.12,
      start_value: 355.00,
      start_date: "2024-01-01",
    },
  ],
};



const fakeOnPlaceOrder = ({
  type,
  symbol_id,
  quantity,
  price,
}: {
  type: "buy" | "sell";
  symbol_id: number;
  quantity: number;
  price: number;
}) => {
  console.log("Fake order placed:", { type, symbol_id, quantity, price });
};



const TestChatPage = () => {

  const assets = [
    {
        ticker: "AAPL",
        name: "Apple",
        ticker_id: 1,
        price: 100,
        asset_type: "stock",
        last_close: 95
      
    },
    {
      ticker: "AAPL",
      name: "Apple Corporation Inc",
      ticker_id: 1,
      price: 100.0000,
      asset_type: "stock",
      last_close: 95
    
  },
  {
    ticker: "AAPL",
    name: "Apple",
    ticker_id: 1,
    price: 100,
    asset_type: "stock",
    last_close: 95
  
},
{
  ticker: "AAPL",
  name: "Apple",
  ticker_id: 1,
  price: 100,
  asset_type: "stock",
  last_close: 95

},
{
  ticker: "AAPL",
  name: "Apple",
  ticker_id: 1,
  price: 100,
  asset_type: "stock",
  last_close: 95

}
  ]


  /*
  breakdown = [
    { label: "stock", percentage: 40 },
    { label: "crypto", percentage: 40 },
    { label: "etf", percentage: 20 }
  ]
  */
//   const startDate = new Date("2023-01-01").valueOf(); // or 1672531200000

//   const result1 = analyzeTransactionHistory(fake_transaction_history, startDate);

//   console.log("result1 is: ", result1)
//   const result = analyzePortfolio(fake_portfolio);
// console.log(result.numberOfAssets);
// console.log(result.unrealizedGainLoss);
// console.log(result.topGainers);
// console.log(result.topLosers);
// console.log(result.assetTypeAllocation);
// console.log(result.stockSectorAllocation);

const data = [
  { "price": 150.12, "time": 1717995600000 }, // Example: June 10, 2024 05:00:00 GMT
  { "price": 150.35, "time": 1717999200000 }, // Example: June 10, 2024 06:00:00 GMT
  { "price": 150.28, "time": 1718002800000 }, // Example: June 10, 2024 07:00:00 GMT
  { "price": 149.95, "time": 1718006400000 }, // Example: June 10, 2024 08:00:00 GMT
  { "price": 150.05, "time": 1718010000000 }, // Example: June 10, 2024 09:00:00 GMT
  { "price": 150.40, "time": 1718013600000 }, // Example: June 10, 2024 10:00:00 GMT
  { "price": 150.65, "time": 1718017200000 }, // Example: June 10, 2024 11:00:00 GMT
  { "price": 150.50, "time": 1718020800000 }, // Example: June 10, 2024 12:00:00 GMT
  { "price": 150.80, "time": 1718024400000 }, // Example: June 10, 2024 13:00:00 GMT
  { "price": 151.15, "time": 1718028000000 }, // Example: June 10, 2024 14:00:00 GMT
  { "price": 150.90, "time": 1718031600000 }, // Example: June 10, 2024 15:00:00 GMT
  { "price": 150.75, "time": 1718035200000 }, // Example: June 10, 2024 16:00:00 GMT
  { "price": 151.00, "time": 1718038800000 }, // Example: June 10, 2024 17:00:00 GMT
  { "price": 151.30, "time": 1718042400000 }, // Example: June 10, 2024 18:00:00 GMT
  { "price": 151.22, "time": 1718046000000 }, // Example: June 10, 2024 19:00:00 GMT
  { "price": 150.98, "time": 1718049600000 }, // Example: June 10, 2024 20:00:00 GMT
  { "price": 151.10, "time": 1718053200000 }, // Example: June 10, 2024 21:00:00 GMT
  { "price": 151.45, "time": 1718056800000 }, // Example: June 10, 2024 22:00:00 GMT
  { "price": 151.60, "time": 1718060400000 }, // Example: June 10, 2024 23:00:00 GMT
  { "price": 151.55, "time": 1718064000000 }  // Example: June 11, 2024 00:00:00 GMT
]
;




    const snapshots= [
        {
          "ticker": "AAPL",
          "snapshot": {
            "Ticker": "AAPL",
            "currentPrice": 202.8479,
            "low": 201.1621,
            "high": 212.94,
            "open": 211.44,
            "volume": 63376484,
            "prevClose": 198.15
          }
        },
        {
          "ticker": "TSLA",
          "snapshot": {
            "Ticker": "TSLA",
            "currentPrice": 249.15,
            "low": 246.2801,
            "high": 261.8,
            "open": 258.36,
            "volume": 59289770,
            "prevClose": 252.31
          }
        }
      ]


const ratings = [
  {
    "ticker": "AAPL",
    "ratings": {
      "id": 1,
      "symbol_id": 1,
      "rating": 4.1064,
      "target_price": 247.925,
      "strong_buy_count": 24,
      "buy_count": 8,
      "hold_count": 12,
      "sell_count": 2,
      "strong_sell_count": 1,
      "created_at": "2025-02-11T09:40:12.945344"
    }
  },
  {
    "ticker": "TSLA",
    "ratings": {
      "id": 8,
      "symbol_id": 7487,
      "rating": 3.25,
      "target_price": 296.7109,
      "strong_buy_count": 14,
      "buy_count": 6,
      "hold_count": 15,
      "sell_count": 4,
      "strong_sell_count": 9,
      "created_at": "2025-02-22T17:57:31.307997"
    }
  }
]



  const pdata = {
    Ticker: "AAPL",
    currentPrice: 192.1,
    low: 191.12,
    high: 193.5,
    open: 192.0,
    volume: 123456,
    prevClose: 191.49,
  };

 


  const staticTestResults = [{
    "id": 1,
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "asset_type": "stock",
    "insight": "Apple's strong ecosystem, consistent innovation, and robust financials position it well for continued growth and resilience in the tech sector.",
    "polygon_snapshot": {
      "current_price": 198.15,
      "last_close": 190.42,
      "day_high": 199.54,
      "day_low": 186.06,
      "updated": 1744416000000000000
    }
  },
   {
    "id": 2,
    "ticker": "BTC",
    "name": "Bitcoin",
    "asset_type": "crypto",
    "insight": "Bitcoin's strong momentum indicators suggest a bullish trend, positioning it favorably for potential price appreciation.",
    "polygon_snapshot": {
      "current_price": 101,
      "last_close": 100,
      "day_high": 101.5,
      "day_low": 99.8,
      "updated": 1744724081142
    }
  },
   {
    "id": 3,
    "ticker": "A",
    "name": "Agilent Technologies Inc",
    "asset_type": "stock",
    "insight": "Agilent Technologies is poised for growth due to strong demand in life sciences and diagnostics, driven by healthcare advancements.",
    "polygon_snapshot": {
      "current_price": 102.71,
      "last_close": 99.95,
      "day_high": 103.335,
      "day_low": 98.86,
      "updated": 1744415820000000000
    }
  }];


//   const now        = Date.now();
// const eightHours = 8 * 60 * 60 * 1000;

// const oneDayData = generatePriceSeriesPerlin(
//   120.0,        // open
//   151.55,       // close
//   5,          // max ±0.60 fluctuation
//   now - eightHours,
//   now,
//   50             // six points → like your sample
// );

// // Map into your periodDataMap
// console.log(JSON.stringify(oneDayData))

const folders = [
  {
    iconName: "book",
    title: "Investing 101",
    subtext: "Learn the basics of investing",
    onClick: () => console.log("Clicked Investing 101"),
  },
  {
    iconName: "book",
    title: "Saving Strategies",
    subtext: "How to grow your savings efficiently",
    onClick: () => console.log("Clicked Saving Strategies"),
  },
];


const now         = Date.now();
const eightHours  = 8 * 60 * 60 * 1000;

const series = generatePriceSeriesPivots(
  150,         // start price
  152,         // end   price
  0.9,         // max deviation ±
  now - eightHours,
  now,
  60           // 60 points
);

console.log(JSON.stringify(series))
return (

    <div>
{/* <CompareTest></CompareTest> */}

<PickPair></PickPair>

<KnowledgeFolderList items={folders} />;

<KnowledgeItemList
  items={[
    { iconName: "lamp", text: "What is compound interest?" },
    { iconName: "lamp", text: "How to analyze stock trends?" },
    { iconName: "lamp", text: "Basics of ETFs" }
  ]}
  title={"Learn about this"}
  onItemClick={(text) => console.log("User clicked:", text)}
/>

{/* <PickPair/> */}



{/* <Loading/> */}
   {/* <AssetsWithInsight data={staticTestResults}/> */}
      {/* <MetricComparison rawData={dataForComparisonTable}/> */}

      {/* <ComparisonHeader snapshots={snapshots}/> */}

      {/* <CustomComparisonChart symbols={['AAPL','TSLA']} language={'en'}/> */}


      {/* <CompareRatings ratings={ratings}/> */}


      {/* <TestExaSearch/> */}
     {/* <TestCompareAPI/> */}

      {/* <PolygonSnapshot data={pdata} />; */}


{/* <DetachedChart symbol={'AAPL'} language={'en'}/> */}
 {/* <TestAnalyzeTicker />;  */}

{/* <TestExaSearch/> */}

{/* <SimpleChart data={data} symbol={'AAPL'} language={'en'}/> */}
{/* <TestPortfolioOverview/> */}

{/* <PortfolioWithPricesTest/> */}
{/* 
<TestAllSymbols></TestAllSymbols>
<TestSymbolSnapshot></TestSymbolSnapshot> */}
{/* <TestPolygonSnapshot/> */}
<div className={styles.testdiv}>

{/* <OverviewHeader start_amount={12500} end_amount={14230.75} /> */}

{/* <PortfolioSummary data={portfolioData} /> */}

 {/* <AssetListCollapse assets={assets} title={"Assets"}></AssetListCollapse>  */}
</div>




{/* 

<PercentageOverviewBox
  titleKey="portfolio.breakdown"
  items={[
    { labelKey: 'stocks', percentage: 40 },
    { labelKey: 'crypto', percentage: 30 },
    { labelKey: 'cash', percentage: 30 },
  ]}
/>

<AnalystRatings2 ticker_symbol="AAPL"></AnalystRatings2> */}





{/* <AnalystRatings ticker_symbol={"AAPL"} language={"en"} />

<ConversationHistory user_id="abc"></ConversationHistory>

<LatestNews
  news={[
    {
      label: 'Markets Rally After Fed Decision',
      source: 'CNBC',
      description: 'Stocks soared after the Federal Reserve announced...',
      imageUrl: 'https://example.com/image1.jpg',
    },
    {
      label: 'Crypto Rebounds Strongly',
      source: 'CoinDesk',
      description: 'Bitcoin and Ethereum lead the crypto recovery...',
    },
  ]}
  title={"Latest News"}
/> */}



{/* 
 <ComparisonChart tickers={["AAPL", "TSLA"]}/>
<CompareTestComponent/>
<ComparisonTable
  data={dataForComparisonTable}
/>  */}

    </div>
  );
};

export default TestChatPage;





// [
//   {
//     "id": 1,
//     "ticker_symbol": "AAPL",
//     "data_for_ai": {
//       "Company Profile": {
//         "name": "Apple Inc.",
//         "description": "Apple is among the largest companies in the world, with a broad portfolio of hardware and software products targeted at consumers and businesses. Apple's iPhone makes up a majority of the firm sales, and Apple's other products like Mac, iPad, and Watch are designed around the iPhone as the focal point of an expansive software ecosystem. Apple has progressively worked to add new applications, like streaming video, subscription bundles, and augmented reality. The firm designs its own software and semiconductors while working with subcontractors like Foxconn and TSMC to build its products and chips. Slightly less than half of Apple's sales come directly through its flagship stores, with a majority of sales coming indirectly through partnerships and distribution."
//       },
//       "Technical Indicators": {
//         "Simple Moving Average": 230.3722,
//         "Relative Strength Index": 41.48112814,
//         "Exponential Moving Average": 229.12555436,
//         "MACD Value": -4.0859088,
//         "MACD Signal": -4.78268534,
//         "MACD Histogram": 0.69677654
//       },
//       "Financials": {
//        etc.
        
//       }
//     }
//   },
//   {
//     "id": 7487,
//     "ticker_symbol": "TSLA",
//     "data_for_ai": {
//       "Company Profile": {
//         "name": "Tesla, Inc. Common Stock",
//         "description": "Tesla is a vertically integrated battery electric vehicle automaker and developer of autonomous driving software. The company has multiple vehicles in its fleet, which include luxury and midsize sedans, crossover SUVs, a light truck, and a semi truck. Tesla also plans to begin selling more affordable vehicles, a sports car, and a robotaxi. Global deliveries in 2024 were a little below 1.8 million vehicles. The company sells batteries for stationary storage for residential and commercial properties including utilities and solar panels and solar roofs for energy generation. Tesla also owns a fast-charging network."
//       },
//       "Technical Indicators": {
//         "Relative Strength Index": 45.20793811,
//         "Simple Moving Average": 322.4788,
//         "Exponential Moving Average": 302.90805996,
//         "MACD Value": -13.87416863,
//         "MACD Signal": -21.71141672,
//         "MACD Histogram": 7.83724809
//       },
//       "Financials": {
//         etc.



// const dataForComparisonTable = [
//   { "id": 1,
//     "ticker_symbol": "AAPL",
//     "data_for_ai": {
//       "Company Profile": {
//         "name": "Apple Inc.",
//         "description": "Apple is among the largest companies in the world, with a broad portfolio of hardware and software products targeted at consumers and businesses. Apple's iPhone makes up a majority of the firm sales, and Apple's other products like Mac, iPad, and Watch are designed around the iPhone as the focal point of an expansive software ecosystem. Apple has progressively worked to add new applications, like streaming video, subscription bundles, and augmented reality. The firm designs its own software and semiconductors while working with subcontractors like Foxconn and TSMC to build its products and chips. Slightly less than half of Apple's sales come directly through its flagship stores, with a majority of sales coming indirectly through partnerships and distribution."
//       },
//       "Technical Indicators": {
//         "Simple Moving Average": 230.3722,
//         "Relative Strength Index": 41.48112814,
//         "Exponential Moving Average": 229.12555436,
//         "MACD Value": -4.0859088,
//         "MACD Signal": -4.78268534,
//         "MACD Histogram": 0.69677654
//       },

//       "Financials": {
//         "balance_sheet": {
//           "Assets": {
//             "value": "344 Billion",
//             "one_quarter_trend": "-5.72%",
//             "one_year_trend": "-2.67%"
//           },
//           "Current Assets": {
//             "value": "133 Billion",
//             "one_quarter_trend": "-12.91%",
//             "one_year_trend": "-7.27%"
//           },
//           "Inventory": {
//             "value": "7 Billion",
//             "one_quarter_trend": "-5.15%",
//             "one_year_trend": "6.14%"
//           },
//           "Fixed Assets": {
//             "value": "46 Billion",
//             "one_quarter_trend": "0.85%",
//             "one_year_trend": "5.50%"
//           },
//           "Liabilities": {
//             "value": "277 Billion",
//             "one_quarter_trend": "-9.97%",
//             "one_year_trend": "-0.75%"
//           },
//           "Current Liabilities": {
//             "value": "144 Billion",
//             "one_quarter_trend": "-18.16%",
//             "one_year_trend": "7.76%"
//           },
//           "Accounts Payable": {
//             "value": "62 Billion",
//             "one_quarter_trend": "-10.22%",
//             "one_year_trend": "6.47%"
//           },
//           "Long-term Debt": {
//             "value": "95 Billion",
//             "one_quarter_trend": "-1.93%",
//             "one_year_trend": "-10.57%"
//           },
//           "Equity": {
//             "value": "67 Billion",
//             "one_quarter_trend": "17.22%",
//             "one_year_trend": "-9.91%"
//           }
//         },
//         "cash_flow_statement": {
//           "Net Cash Flow From Operating Activities": {
//             "value": "30 Billion",
//             "one_quarter_trend": "11.65%",
//             "one_year_trend": "-24.97%"
//           },
//           "Net Cash Flow From Investing Activities": {
//             "value": "10 Billion",
//             "one_quarter_trend": "577.65%",
//             "one_year_trend": "408.15%"
//           },
//           "Net Cash Flow From Financing Activities": {
//             "value": "-39 Billion",
//             "one_quarter_trend": "-57.81%",
//             "one_year_trend": "-28.73%"
//           },
//           "Net Cash Flow": {
//             "value": "356 Million",
//             "one_quarter_trend": "-89.24%",
//             "one_year_trend": "-96.83%"
//           }
//         },
//         "income_statement": {
//           "Revenues": {
//             "value": "124 Billion",
//             "one_quarter_trend": "30.94%",
//             "one_year_trend": "3.95%"
//           },
//           "Cost Of Revenue": {
//             "value": "66 Billion",
//             "one_quarter_trend": "29.33%",
//             "one_year_trend": "2.02%"
//           },
//           "Gross Profit": {
//             "value": "58 Billion",
//             "one_quarter_trend": "32.81%",
//             "one_year_trend": "6.23%"
//           },
//           "Operating Expenses": {
//             "value": "15 Billion",
//             "one_quarter_trend": "8.08%",
//             "one_year_trend": "6.64%"
//           },
//           "Research and Development": {
//             "value": "8 Billion",
//             "one_quarter_trend": "6.48%",
//             "one_year_trend": "7.43%"
//           },
//           "Operating Income/Loss": {
//             "value": "43 Billion",
//             "one_quarter_trend": "44.75%",
//             "one_year_trend": "6.09%"
//           },
//           "Income Tax Expense/Benefit": {
//             "value": "6 Billion",
//             "one_quarter_trend": "-57.95%",
//             "one_year_trend": "-2.39%"
//           },
//           "Net Income/Loss": {
//             "value": "36 Billion",
//             "one_quarter_trend": "146.54%",
//             "one_year_trend": "7.12%"
//           },
//           "Basic Earnings Per Share": {
//             "value": "2.41",
//             "one_quarter_trend": "145.92%",
//             "one_year_trend": "10.05%"
//           },
//           "Diluted Earnings Per Share": {
//             "value": "2.4",
//             "one_quarter_trend": "147.42%",
//             "one_year_trend": "10.09%"
//           },
//           "Basic Average Shares": {
//             "value": "15 Billion",
//             "one_quarter_trend": "26437.18%",
//             "one_year_trend": "-2.76%"
//           },
//           "Diluted Average Shares": {
//             "value": "15 Billion",
//             "one_quarter_trend": "27607.02%",
//             "one_year_trend": "-2.73%"
//           }
//         }
//       }
//     }
//   },
//   {
//     "id": 7487,
//     "ticker_symbol": "TSLA",
//     "data_for_ai": {
//       "Company Profile": {
//         "name": "Tesla, Inc. Common Stock",
//         "description": "Tesla is a vertically integrated battery electric vehicle automaker and developer of autonomous driving software. The company has multiple vehicles in its fleet, which include luxury and midsize sedans, crossover SUVs, a light truck, and a semi truck. Tesla also plans to begin selling more affordable vehicles, a sports car, and a robotaxi. Global deliveries in 2024 were a little below 1.8 million vehicles. The company sells batteries for stationary storage for residential and commercial properties including utilities and solar panels and solar roofs for energy generation. Tesla also owns a fast-charging network."
//       },
//       "Technical Indicators": {
//         "Relative Strength Index": 45.20793811,
//         "Simple Moving Average": 322.4788,
//         "Exponential Moving Average": 302.90805996,
//         "MACD Value": -13.87416863,
//         "MACD Signal": -21.71141672,
//         "MACD Histogram": 7.83724809
//       },
//       "Financials": {
//         "balance_sheet": {
//           "Assets": {
//             "value": "122 Billion",
//             "one_quarter_trend": "1.85%",
//             "one_year_trend": "14.49%"
//           },
//           "Current Assets": {
//             "value": "58 Billion",
//             "one_quarter_trend": "3.51%",
//             "one_year_trend": "17.62%"
//           },
//           "Inventory": {
//             "value": "12 Billion",
//             "one_quarter_trend": "-17.30%",
//             "one_year_trend": "-11.81%"
//           },
//           "Fixed Assets": {
//             "value": "36 Billion",
//             "one_quarter_trend": "-0.78%",
//             "one_year_trend": "20.56%"
//           },
//           "Intangible Assets": {
//             "value": "150 Million",
//             "one_quarter_trend": "-5.06%",
//             "one_year_trend": "-15.73%"
//           },
//           "Liabilities": {
//             "value": "48 Billion",
//             "one_quarter_trend": "-1.53%",
//             "one_year_trend": "12.51%"
//           },
//           "Current Liabilities": {
//             "value": "29 Billion",
//             "one_quarter_trend": "-5.74%",
//             "one_year_trend": "0.25%"
//           },
//           "Accounts Payable": {
//             "value": "12 Billion",
//             "one_quarter_trend": "-14.88%",
//             "one_year_trend": "-13.56%"
//           },
//           "Long-term Debt": {
//             "value": "6 Billion",
//             "one_quarter_trend": "4.93%",
//             "one_year_trend": "106.38%"
//           },
//           "Equity": {
//             "value": "74 Billion",
//             "one_quarter_trend": "4.21%",
//             "one_year_trend": "16.18%"
//           }
//         },
//         "cash_flow_statement": {
//           "Net Cash Flow From Operating Activities": {
//             "value": "5 Billion",
//             "one_quarter_trend": "-23.04%",
//             "one_year_trend": "10.16%"
//           },
//           "Net Cash Flow From Investing Activities": {
//             "value": "-8 Billion",
//             "one_quarter_trend": "-164.45%",
//             "one_year_trend": "-58.26%"
//           },
//           "Net Cash Flow From Financing Activities": {
//             "value": "985 Million",
//             "one_quarter_trend": "646.21%",
//             "one_year_trend": "11.05%"
//           },
//           "Net Cash Flow": {
//             "value": "-2 Billion",
//             "one_quarter_trend": "-151.37%",
//             "one_year_trend": "-498.23%"
//           }
//         },
//         "income_statement": {
//           "Revenues": {
//             "value": "26 Billion",
//             "one_quarter_trend": "2.08%",
//             "one_year_trend": "2.15%"
//           },
//           "Cost Of Revenue": {
//             "value": "22 Billion",
//             "one_quarter_trend": "6.65%",
//             "one_year_trend": "3.85%"
//           },
//           "Gross Profit": {
//             "value": "4 Billion",
//             "one_quarter_trend": "-16.37%",
//             "one_year_trend": "-5.84%"
//           },
//           "Operating Expenses": {
//             "value": "3 Billion",
//             "one_quarter_trend": "13.86%",
//             "one_year_trend": "9.35%"
//           },
//           "Research and Development": {
//             "value": "1 Billion",
//             "one_quarter_trend": "22.81%",
//             "one_year_trend": "16.64%"
//           },
//           "Operating Income/Loss": {
//             "value": "2 Billion",
//             "one_quarter_trend": "-41.74%",
//             "one_year_trend": "-23.30%"
//           },
//           "Income Tax Expense/Benefit": {
//             "value": "434 Million",
//             "one_quarter_trend": "-27.79%",
//             "one_year_trend": "107.55%"
//           },
//           "Net Income/Loss": {
//             "value": "2 Billion",
//             "one_quarter_trend": "6.83%",
//             "one_year_trend": "-70.64%"
//           },
//           "Basic Earnings Per Share": {
//             "value": "0.72",
//             "one_quarter_trend": "5.88%",
//             "one_year_trend": "-71.20%"
//           },
//           "Diluted Earnings Per Share": {
//             "value": "0.66",
//             "one_quarter_trend": "6.45%",
//             "one_year_trend": "-70.93%"
//           },
//           "Basic Average Shares": {
//             "value": "5 Million",
//             "one_quarter_trend": "-99.84%",
//             "one_year_trend": "66.67%"
//           },
//           "Diluted Average Shares": {
//             "value": "9 Million",
//             "one_quarter_trend": "-99.74%",
//             "one_year_trend": "125.00%"
//           }
//         }
//       }
//     }
//   }
// ]