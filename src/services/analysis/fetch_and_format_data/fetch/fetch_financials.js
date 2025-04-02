async function fetchFinancials(tickerSymbol, symbol_id, supabase_client) {
    try {
        // 1️⃣ Fetch symbol_id for the given ticker
        console.log("Inputs to fetch financials are: ", tickerSymbol, symbol_id)
       
        // 2️⃣ Get the three most relevant quarterly reports
        const { data: reports, error: reportError } = await supabase_client
            .from("financial_reports")
            .select("id, end_date")
            .eq("symbol_id", symbol_id)
            .eq("timeframe", "quarterly")
            .order("end_date", { ascending: false }) // Get most recent first
            .limit(5); // Fetch more in case of missing data

        if (reportError) throw reportError;
        if (!reports || reports.length < 2) {
            throw new Error(`Not enough quarterly financial reports found for symbol '${tickerSymbol}'.`);
        }
        
        // Extract the three relevant report IDs
        const latestReport = reports[0];  // Most recent
        const prevReport = reports[1] || null;  // Previous quarter
        const oneYearAgoReport = reports[4] || null;  // Four quarters before

        const reportIds = [latestReport.id];
        if (prevReport) reportIds.push(prevReport.id);
        if (oneYearAgoReport) reportIds.push(oneYearAgoReport.id);

        // 3️⃣ Fetch all financial statement items for the selected reports
        const { data: statementItems, error: statementError } = await supabase_client
            .from("financial_statement_items")
            .select("report_id, statement_type, label, value")
            .in("report_id", reportIds)
            .order("statement_type", { ascending: true })
            .order("order_number", { ascending: true });

        if (statementError) throw statementError;
        if (!statementItems || statementItems.length === 0) {
            throw new Error(`No financial statement items found for reports.`);
        }

        // 4️⃣ Organize data and compute trends
        const formattedData = {};

        // Structure items by statement_type
        const reportData = {};
        for (const item of statementItems) {
            if (!reportData[item.report_id]) {
                reportData[item.report_id] = {};
            }
            if (!reportData[item.report_id][item.statement_type]) {
                reportData[item.report_id][item.statement_type] = {};
            }
            reportData[item.report_id][item.statement_type][item.label] = item.value;
        }

        // Compute trends and format output
        for (const statementType in reportData[latestReport.id]) {
            formattedData[statementType] = {};

            for (const label in reportData[latestReport.id][statementType]) {
                const latestValue = reportData[latestReport.id][statementType][label];
                const prevValue = prevReport ? reportData[prevReport.id]?.[statementType]?.[label] : null;
                const oneYearValue = oneYearAgoReport ? reportData[oneYearAgoReport.id]?.[statementType]?.[label] : null;

                // Compute percentage trends
                const oneQuarterTrend = prevValue && prevValue !== 0
                    ? ((latestValue - prevValue) / Math.abs(prevValue)) * 100
                    : null;

                const oneYearTrend = oneYearValue && oneYearValue !== 0
                    ? ((latestValue - oneYearValue) / Math.abs(oneYearValue)) * 100
                    : null;

                // Structure data with trends
                formattedData[statementType][label] = {
                    "value": latestValue,
                    "one_quarter_trend": oneQuarterTrend !== null ? `${oneQuarterTrend.toFixed(2)}%` : "N/A",
                    "one_year_trend": oneYearTrend !== null ? `${oneYearTrend.toFixed(2)}%` : "N/A"
                };
            }
        }
       
        //await saveToJson(formatFinancialData(formattedData));  // Saves data to 'formatted_data.json'
        return formattedData;

    } catch (error) {
        console.error("Error fetching data for AI:", error.message);
        return null;
    }
}

export default fetchFinancials;

// fetchDataForAi("AAPL", supabase_client)



/*

remove the following items:
- Equity Attributable To Noncontrolling Interest
- Equity Attributable To Parent

If there is continuing, remove:
'Net Cash Flow From Operating Activities': {
      value: 29935000000,
      one_quarter_trend: '11.65%',
      one_year_trend: '-24.97%'
    },
    'Net Cash Flow From Operating Activities, Continuing


formatted data is:  {
  balance_sheet: {
    Assets: {
      value: 344085000000,
      one_quarter_trend: '-5.72%',
      one_year_trend: '-2.67%'
    },
    'Current Assets': {
      value: 133240000000,
      one_quarter_trend: '-12.91%',
      one_year_trend: '-7.27%'
    },
    Inventory: {
      value: 6911000000,
      one_quarter_trend: '-5.15%',
      one_year_trend: '6.14%'
    },
    'Other Current Assets': {
      value: 126329000000,
      one_quarter_trend: '-13.30%',
      one_year_trend: '-7.91%'
    },
    'Noncurrent Assets': {
      value: 210845000000,
      one_quarter_trend: '-0.54%',
      one_year_trend: '0.49%'
    },
    'Fixed Assets': {
      value: 46069000000,
      one_quarter_trend: '0.85%',
      one_year_trend: '5.50%'
    },
    'Other Non-current Assets': {
      value: 164776000000,
      one_quarter_trend: '-0.92%',
      one_year_trend: '-0.83%'
    },
    Liabilities: {
      value: 277327000000,
      one_quarter_trend: '-9.97%',
      one_year_trend: '-0.75%'
    },
    'Current Liabilities': {
      value: 144365000000,
      one_quarter_trend: '-18.16%',
      one_year_trend: '7.76%'
    },
    'Accounts Payable': {
      value: 61910000000,
      one_quarter_trend: '-10.22%',
      one_year_trend: '6.47%'
    },
    'Other Current Liabilities': {
      value: 82455000000,
      one_quarter_trend: '-23.25%',
      one_year_trend: '8.74%'
    },
    'Noncurrent Liabilities': {
      value: 132962000000,
      one_quarter_trend: '1.01%',
      one_year_trend: '-8.58%'
    },
    'Long-term Debt': {
      value: 94800000000,
      one_quarter_trend: '-1.93%',
      one_year_trend: '-10.57%'
    },
    'Other Non-current Liabilities': {
      value: 38162000000,
      one_quarter_trend: '9.11%',
      one_year_trend: '-3.24%'
    },
    Equity: {
      value: 66758000000,
      one_quarter_trend: '17.22%',
      one_year_trend: '-9.91%'
    },
    'Equity Attributable To Noncontrolling Interest': { value: 0, one_quarter_trend: 'N/A', one_year_trend: 'N/A' },
    'Equity Attributable To Parent': {
      value: 66758000000,
      one_quarter_trend: '17.22%',
      one_year_trend: '-9.91%'
    },
    'Liabilities And Equity': {
      value: 344085000000,
      one_quarter_trend: '-5.72%',
      one_year_trend: '-2.67%'
    }
  },
  cash_flow_statement: {
    'Net Cash Flow From Operating Activities': {
      value: 29935000000,
      one_quarter_trend: '11.65%',
      one_year_trend: '-24.97%'
    },
    'Net Cash Flow From Operating Activities, Continuing': {
      value: 29935000000,
      one_quarter_trend: '11.65%',
      one_year_trend: '-24.97%'
    },
    'Net Cash Flow From Investing Activities': {
      value: 9792000000,
      one_quarter_trend: '577.65%',
      one_year_trend: '408.15%'
    },
    'Net Cash Flow From Investing Activities, Continuing': {
      value: 9792000000,
      one_quarter_trend: '577.65%',
      one_year_trend: '408.15%'
    },
    'Net Cash Flow From Financing Activities': {
      value: -39371000000,
      one_quarter_trend: '-57.81%',
      one_year_trend: '-28.73%'
    },
    'Net Cash Flow From Financing Activities, Continuing': {
      value: -39371000000,
      one_quarter_trend: '-57.81%',
      one_year_trend: '-28.73%'
    },
    'Net Cash Flow': {
      value: 356000000,
      one_quarter_trend: '-89.24%',
      one_year_trend: '-96.83%'
    },
    'Net Cash Flow, Continuing': {
      value: 356000000,
      one_quarter_trend: '-89.24%',
      one_year_trend: '-96.83%'
    }
  },
  comprehensive_income: {
    'Comprehensive Income/Loss': {
      value: 36713000000,
      one_quarter_trend: '129.74%',
      one_year_trend: '2.01%'
    },
    'Comprehensive Income/Loss Attributable To Noncontrolling Interest': { value: 0, one_quarter_trend: 'N/A', one_year_trend: 'N/A' },
    'Comprehensive Income/Loss Attributable To Parent': {
      value: 36713000000,
      one_quarter_trend: '129.74%',
      one_year_trend: '2.01%'
    },
    'Other Comprehensive Income/Loss': {
      value: 36713000000,
      one_quarter_trend: '129.74%',
      one_year_trend: '2.01%'
    },
    'Other Comprehensive Income/Loss Attributable To Parent': {
      value: 383000000,
      one_quarter_trend: '-69.21%',
      one_year_trend: '-81.53%'
    }
  },
  income_statement: {
    Revenues: {
      value: 124300000000,
      one_quarter_trend: '30.94%',
      one_year_trend: '3.95%'
    },
    'Benefits Costs and Expenses': {
      value: 81716000000,
      one_quarter_trend: '25.10%',
      one_year_trend: '3.11%'
    },
    'Cost Of Revenue': {
      value: 66025000000,
      one_quarter_trend: '29.33%',
      one_year_trend: '2.02%'
    },
    'Costs And Expenses': {
      value: 81716000000,
      one_quarter_trend: '25.10%',
      one_year_trend: '3.11%'
    },
    'Gross Profit': {
      value: 58275000000,
      one_quarter_trend: '32.81%',
      one_year_trend: '6.23%'
    },
    'Nonoperating Income/Loss': {
      value: -248000000,
      one_quarter_trend: '-1405.26%',
      one_year_trend: '-396.00%'
    },
    'Operating Expenses': {
      value: 15443000000,
      one_quarter_trend: '8.08%',
      one_year_trend: '6.64%'
    },
    'Selling, General, and Administrative Expenses': {
      value: 7175000000,
      one_quarter_trend: '10.00%',
      one_year_trend: '5.73%'
    },
    'Research and Development': {
      value: 8268000000,
      one_quarter_trend: '6.48%',
      one_year_trend: '7.43%'
    },
    'Operating Income/Loss': {
      value: 42832000000,
      one_quarter_trend: '44.75%',
      one_year_trend: '6.09%'
    },
    'Income/Loss From Continuing Operations After Tax': {
      value: 36330000000,
      one_quarter_trend: '146.54%',
      one_year_trend: '7.12%'
    },
    'Income/Loss From Continuing Operations Before Tax': {
      value: 42584000000,
      one_quarter_trend: '43.82%',
      one_year_trend: '5.61%'
    },
    'Income Tax Expense/Benefit': {
      value: 6254000000,
      one_quarter_trend: '-57.95%',
      one_year_trend: '-2.39%'
    },
    'Net Income/Loss': {
      value: 36330000000,
      one_quarter_trend: '146.54%',
      one_year_trend: '7.12%'
    },
    'Net Income/Loss Attributable To Noncontrolling Interest': { value: 0, one_quarter_trend: 'N/A', one_year_trend: 'N/A' },
    'Net Income/Loss Attributable To Parent': {
      value: 36330000000,
      one_quarter_trend: '146.54%',
      one_year_trend: '7.12%'
    },
    'Net Income/Loss Available To Common Stockholders, Basic': {
      value: 36330000000,
      one_quarter_trend: '146.54%',
      one_year_trend: '7.12%'
    },
    'Participating Securities, Distributed And Undistributed Earnings/Loss, Basic': { value: 0, one_quarter_trend: 'N/A', one_year_trend: 'N/A' },
    'Preferred Stock Dividends And Other Adjustments': { value: 0, one_quarter_trend: 'N/A', one_year_trend: 'N/A' },
    'Basic Earnings Per Share': {
      value: 2.41,
      one_quarter_trend: '145.92%',
      one_year_trend: '10.05%'
    },
    'Diluted Earnings Per Share': {
      value: 2.4,
      one_quarter_trend: '147.42%',
      one_year_trend: '10.09%'
    },
    'Basic Average Shares': {
      value: 15081724000,
      one_quarter_trend: '26437.18%',
      one_year_trend: '-2.76%'
    },
    'Diluted Average Shares': {
      value: 15150865000,
      one_quarter_trend: '27607.02%',
      one_year_trend: '-2.73%'
    }
  }
}



  */