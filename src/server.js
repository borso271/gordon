

import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import WebSocket from "ws";
import saveIntradayData from "./services/chart_data/intraday/batch_save.js";
import { updateStockCache } from "./services/chart_data/intraday/update_stock_cache.js";

const API_KEY = "demo";
const WS_URL = `wss://ws.eodhistoricaldata.com/ws/us?api_token=${API_KEY}`;
const SUBSCRIBE_MESSAGE = JSON.stringify({
    action: "subscribe",
    symbols: "AAPL", // You can dynamically generate this list
});

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    console.log("🔌 WebSocket server started");

    // ✅ Connect to External WebSocket (EOD Historical Data)
    const ws = new WebSocket(WS_URL);

    // ✅ Cache to store last updates
    const stockCache = {};
    const lastUpdateTimes = {}; // Track last update time per ticker

    ws.on("open", () => {
        console.log("✅ Connected to EOD Historical Data WebSocket");
        ws.send(SUBSCRIBE_MESSAGE);
    });
    
    
    ws.on("message", async (data) => {
        try {
            const stockData = JSON.parse(data);
            const updates = Array.isArray(stockData) ? stockData : [stockData];
    
            updates.forEach(async (stock) => {
                const { s: symbol, p: price, v: volume, t: timestamp } = stock;
    
                // ✅ Store in stockCache before emitting
                stockCache[symbol] = { symbol, price, volume, timestamp };
    
                await updateStockCache(symbol, price, volume, timestamp); // ✅ Store in DB
    
                console.log("📡 Emitting stock update:", stockCache[symbol]);
                io.emit("stock_update", stockCache[symbol]); // ✅ Send update to all clients
            });
        } catch (err) {
            console.error("❌ Error parsing WebSocket message:", err);
        }
    });
    

    ws.on("error", (err) => console.error("❌ WebSocket error:", err));
    ws.on("close", () => console.log("⚠️ WebSocket connection closed."));

    io.on("connection", (socket) => {
        console.log("✅ Client connected:", socket.id);
        Object.values(stockCache).forEach((stock) => socket.emit("stock_update", stock));
        socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
    });

    server.listen(3006, () => {
        console.log("> Ready on http://localhost:3006");
    });
});


setInterval(saveIntradayData, 5 * 60 * 100);
