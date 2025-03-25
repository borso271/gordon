async function fetchTechnicalIndicators(tickerSymbol, symbol_id, supabase_client) {
    try {
       
        // 2️⃣ Fetch all technical indicators for this symbol
        const { data: indicators, error: indicatorError } = await supabase_client
            .from("technical_indicators")
            .select("indicator, label, timestamp, value")
            .eq("symbol_id", symbol_id)
            .order("timestamp", { ascending: false }); // Most recent first

        if (indicatorError) throw indicatorError;
        if (!indicators || indicators.length === 0) {
            throw new Error(`No technical indicators found for symbol '${tickerSymbol}'.`);
        }

        // 3️⃣ Structure the JSON response as { label: value, label: value, ... }
        const formattedData = {};

        indicators.forEach(item => {
            formattedData[item.label || item.indicator] = item.value;
        });

        // console.log(JSON.stringify(formattedData, null, 2));
        return formattedData;

    } catch (error) {
        console.error("Error fetching technical indicators:", error.message);
        return null;
    }
}

export default fetchTechnicalIndicators;

// fetchTechnicalIndicators("AAPL", supabase_client)