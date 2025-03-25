async function fetchExternalIndicators(tickerSymbol, symbol_id, supabase_client) {
    try {
        // 2️⃣ Fetch all external indicators for this symbol
        const { data: indicators, error: indicatorError } = await supabase_client
            .from("external_indicators")
            .select("indicator, label, timestamp, value")
            .eq("symbol_id", symbol_id)
            .order("timestamp", { ascending: false }); // Most recent first

        if (indicatorError) throw indicatorError;
        if (!indicators || indicators.length === 0) {
            throw new Error(`No external indicators found for symbol '${tickerSymbol}'.`);
        }

        // 3️⃣ Structure the JSON response as { label: value, label: value, ... }
        const formattedData = {};

        indicators.forEach(item => {
            const label = item.label || item.indicator; // Use label if available
            if (!formattedData[label]) {
                formattedData[label] = item.value; // Keep only the latest value
            }
        });

        // console.log(JSON.stringify(formattedData, null, 2));
        return formattedData;

    } catch (error) {
        console.error("Error fetching external indicators:", error.message);
        return null;
    }
}

export default fetchExternalIndicators;

// fetchExternalIndicators("BTC", supabase_client)