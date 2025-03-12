import { createSlice } from "@reduxjs/toolkit";

const stockSlice = createSlice({
    name: "stocks",
    initialState: {}, 
    reducers: {
        updateStock: (state, action) => {
            const { symbol, price, volume, timestamp } = action.payload || {};

            if (!symbol || !price || !timestamp || volume === undefined) {
                console.warn("❌ Invalid stock update received, ignoring...", action.payload);
                return state; 
            }

            if (!state[symbol]) {
                state[symbol] = [];
            }

            state[symbol].push({ price, volume, timestamp });

            // ✅ Keep only the last 5 minutes of data
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            state[symbol] = state[symbol].filter(data => new Date(data.timestamp).getTime() > fiveMinutesAgo);

            // 🔥 Debug Logs
           // console.log(`✅ Redux updated for ${symbol}:`, state[symbol]);
        },
    },
});

export const { updateStock } = stockSlice.actions;
export default stockSlice.reducer;
