"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { updateStock } from "../../app/redux/stock_slice";

const StockWebSocketListener = () => {
  const dispatch = useDispatch();

  // 1) Keep track of the last known stock update per symbol (to skip duplicates)
  const stockCache = useRef(new Map());

  // 2) Keep a buffer of new updates that we'll flush every 5s
  const updatesBuffer = useRef([]);

  useEffect(() => {
    console.log("🛠️ StockWebSocketListener mounted.");

    // Connect via WebSocket
    const socket = io("http://localhost:3006", {
      transports: ["websocket"], // ✅ Force WebSocket transport
    });

    console.log("🌐 Attempting to connect to WebSocket...");

    socket.on("connect", () => {
      console.log("🔗 Connected to WebSocket");
      console.log("🔄 Socket ID:", socket.id);
    });

    socket.on("connect_error", (error) => {
     // console.error("🚨 WebSocket connection error:", error);
    });

    socket.on("error", (error) => {
     // console.error("🔥 WebSocket error:", error);
    });

    socket.on("stock_update", (stock) => {
      console.log("📡 WebSocket received stock update:", stock);

      if (!stock || typeof stock !== "object") {
        console.warn("❌ Received invalid stock update (not an object), ignoring...", stock);
        return;
      }

      const { symbol, price, timestamp } = stock;
      if (!symbol || !price || !timestamp) {
        console.warn("❌ Invalid stock update properties, ignoring...", stock);
        return;
      }

      // Check if we already have an identical update for this symbol
      const lastStock = stockCache.current.get(symbol);
      if (lastStock && lastStock.price === price && lastStock.timestamp === timestamp) {
        console.log("🔄 Skipping duplicate stock update:", stock);
        return;
      }

      // Store the new update in cache so we don't dispatch duplicates
      stockCache.current.set(symbol, stock);

      // Add the new update to our buffer (we'll dispatch it later)
      updatesBuffer.current.push(stock);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from WebSocket:", reason);
    });

    // 3) Every 5 seconds, dispatch all buffered updates
    const intervalId = setInterval(() => {
      if (updatesBuffer.current.length > 0) {
        console.log("🚀 Dispatching buffered updates:", updatesBuffer.current);

        // Dispatch each update in the buffer
        updatesBuffer.current.forEach((update) => {
          dispatch(updateStock(update));
        });

        // Clear the buffer
        updatesBuffer.current = [];
      }
    }, 5000);

    return () => {
      console.log("🧹 Cleaning up WebSocket connection and interval...");
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, [dispatch]);

  return null; // Component doesn't render anything
};

export default StockWebSocketListener;

