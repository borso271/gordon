import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./stock_slice"; // ✅ Import the reducer

const store = configureStore({
    reducer: {
        stocks: stockReducer, // ✅ Add to store
    },
});

export default store;
