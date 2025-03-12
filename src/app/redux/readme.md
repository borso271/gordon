Step	Action
1️⃣ Create Redux store (store.js)	Holds stock price data for multiple stocks
2️⃣ Use stockSlice.js for updates	Supports individual & batch updates
3️⃣ Wrap app with ReduxProvider	Ensures Redux state is available globally
4️⃣ Create WebSocket Hook (useStockWebSocket.js)	Listens for stock_update events
5️⃣ Store multiple stocks in Redux	{ "AAPL": {...}, "TSLA": {...}, ... }
6️⃣ StockChart.js reads Redux & auto-updates	Displays live prices in UI


HANDLING INTRADAY DATA:
2️⃣ Hybrid Approach (Recommended ✅)
First, fetch historical data from the database (e.g., all data before the last 5 minutes).
Then, pull the last 5 minutes of data from Redux.
Merge database + Redux data into a single chart dataset.
Ensure no duplicate timestamps by filtering overlapping data.