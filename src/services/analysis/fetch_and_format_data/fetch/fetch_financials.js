
// import { writeFile } from 'fs/promises';

// /**
//  * Saves formatted data to a JSON file.
//  * @param {Object} formattedData - The data to be saved.
//  * @param {string} filename - The name of the JSON file.
//  */
// async function saveToJson(formattedData, filename = 'formatted_data.json') {
//     try {
//         await writeFile(filename, JSON.stringify(formattedData, null, 2), 'utf8');
//         console.log(`✅ Data successfully saved to ${filename}`);
//     } catch (error) {
//         console.error("❌ Error saving data to JSON:", error);
//     }
// }
async function fetchFinancials(tickerSymbol, symbol_id, supabase_client) {
    try {
        // 1️⃣ Fetch symbol_id for the given ticker
      
       
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
        //console.log("formatted data is: ", formattedData)
        // await saveToJson(formatFinancialData(formattedData));  // Saves data to 'formatted_data.json'
        return formattedData;

    } catch (error) {
        console.error("Error fetching data for AI:", error.message);
        return null;
    }
}

export default fetchFinancials;

// fetchDataForAi("AAPL", supabase_client)