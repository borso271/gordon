/*
insert openai response to the database.
*/

async function insertStockAnalysis(id, ticker, analysis, agent_name, language,supabase_client) {

    try {
        // Ensure analysis is stored as JSONB (stringify if necessary)
        const analysisJson = typeof analysis === "string" ? analysis : JSON.stringify(analysis);

        // Insert data into the stock_analysis table
        const { data, error } = await supabase_client
            .from("stock_analysis")
            .insert([
                {
                    symbol_id: id,
                    symbol: ticker,
                    analysis: analysisJson,
                    agent_name: agent_name,
                    language: language,
                }
            ]);

        if (error) throw error;

        console.log("Stock analysis inserted successfully:", data);
        return data;
    } catch (error) {
        console.error("Error inserting stock analysis:", error.message);
        return null;
    }
}

export default insertStockAnalysis
