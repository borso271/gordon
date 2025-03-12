
"use client"; // ✅ Ensure it's a client component

import { Provider } from "react-redux";
import store from "./redux/store";
import StockWebSocketListener from "../components/Global/StockWebSocketListener"; // ✅ WebSocket listener

export default function ClientWrapper({ children }) {
    return (
        <Provider store={store}>
            <StockWebSocketListener /> {/* ✅ WebSocket runs AFTER Redux Provider is set */}
            {children}
        </Provider>
    );
}
