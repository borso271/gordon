import fetch from "node-fetch";

const API_KEY = "67924fc1e43c51.18581208"; // Replace with your real API key if needed
const BASE_URL = "https://eodhd.com/api/real-time";
const TICKERS = ["AAPL.US", "TSLA.US", "VTI.US", "AMZN.US", "BTC-USD"]; // ✅ List of tickers

async function fetchLivePrices() {
    const url = `${BASE_URL}/${TICKERS[0]}?s=${TICKERS.slice(1).join(",")}&api_token=${API_KEY}&fmt=json`;

    try {
        console.log(`📡 Fetching live stock data at ${new Date().toLocaleTimeString()}...`);

        const response = await fetch(url);
        const data = await response.json();

        if (!data || typeof data !== "object") {
            console.error("❌ Invalid data format received:", data);
            return;
        }

        console.log("📊 Live Minute Data:");
        Object.entries(data).forEach(([symbol, stock]) => {
            if (!stock || !stock.timestamp) {
                console.warn(`⚠️ Missing data for ${symbol}`);
                return;
            }

            // Convert UNIX timestamp to readable time
            const dateTime = new Date(stock.timestamp * 1000).toLocaleString();

            console.log(`🔹 ${symbol}: $${stock.close} | Volume: ${stock.volume} | Time: ${dateTime}`);
        });
    } catch (error) {
        console.error("❌ Error fetching live stock data:", error);
    }
}

// ✅ Run every 1 minute
setInterval(fetchLivePrices, 60 * 1000);

// Run once immediately
fetchLivePrices();

// use 1 minute to fetch the volume...
// you might compute...