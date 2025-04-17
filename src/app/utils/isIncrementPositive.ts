const trendInterpretation = {
    // --- Balance Sheet ---
    "Assets": true,              // Generally good to own more valuable stuff
    "Current Assets": true,      // Generally good to have more short-term resources
    "Inventory": false,            // Generally negative if increasing without corresponding sales growth (risk of obsolescence/storage costs) - **Context dependent!**
    "Fixed Assets": true,        // Generally good (investment in productive capacity), assuming it's utilized effectively
    "Liabilities": false,           // Generally negative to owe more
    "Current Liabilities": false,  // Generally negative to have more short-term obligations
    "Accounts Payable": false,   // Generally negative (more owed short-term), though could temporarily boost cash flow - **Context dependent!**
    "Long-term Debt": false,    // Generally negative (more leverage, interest payments, risk)
    "Equity": true,              // Generally good (higher net worth for shareholders)
  
    // --- Cash Flow Statement ---
    "Net Cash Flow From Operating Activities": true, // Very positive - core business generating more cash
    "Net Cash Flow From Investing Activities": false, // Generally negative if increasing (less negative or more positive) as it often means *less* investment (CapEx) or asset sales. Heavy investment (more negative) is often seen positively for growth. **Context dependent!**
    "Net Cash Flow From Financing Activities": false, // Generally negative if increasing (less negative or more positive) as it often means issuing debt/equity. Decreasing (more negative) often means buybacks/debt repayment/dividends. **Context dependent!**
    "Net Cash Flow": true,       // Generally good to have overall cash increase
  
    // --- Income Statement ---
    "Revenues": true,            // Very positive - more sales
    "Cost Of Revenue": false,    // Negative for this cost line item to increase *on its own*. Desirable for it to increase slower than revenue.
    "Gross Profit": true,        // Very positive - more profit after direct costs
    "Operating Expenses": false, // Negative for expenses to increase *on its own*. Desirable for them to increase slower than revenue or drive future growth. **Context dependent!**
    "Research and Development": false, // Technically an expense, so increase is 'bad' for current profit. BUT, often viewed positively by investors as investment in the future. Sticking to 'false' based on pure P&L impact. **Context dependent!**
    "Operating Income/Loss": true, // Very positive - more profit from core operations
    "Income Tax Expense/Benefit": false, // Negative - paying more tax reduces net income
    "Net Income/Loss": true,     // Very positive - more bottom-line profit
    "Basic Earnings Per Share": true, // Very positive
    "Diluted Earnings Per Share": true, // Very positive
    "Basic Average Shares": false, // Negative - increase means more shares outstanding (potential dilution or less effective buybacks)
    "Diluted Average Shares": false, // Negative - increase means more potential dilution
  
    // --- Technical Indicators ---
    // **Note:** For technicals, 'true' generally means 'bullish signal/momentum', 'false' means 'bearish signal/momentum'. Interpretation is highly context-dependent (levels, crossovers, divergences matter).
    "Simple Moving Average": true,    // Increase indicates price is trending up over the period (bullish)
    "Exponential Moving Average": true, // Increase indicates price is trending up over the period, weighted towards recent prices (bullish)
    "Relative Strength Index": true, // Increase indicates stronger upward price momentum relative to downward. **High levels (>70) can signal overbought (bearish reversal potential).**
    "MACD Value": true,            // Increase indicates strengthening upward momentum (shorter EMA pulling away from longer EMA). Positive value is bullish.
    "MACD Signal": true,           // Increase indicates the trend of the MACD Value itself is upward (bullish).
    "MACD Histogram": true,        // Increase indicates MACD is pulling further above its signal (or less below), signifying accelerating momentum (bullish implication).
  };
  
  // --- Example Usage Function ---
  
  function isIncreaseGenerallyPositive(key) {
    // Return the boolean value if the key exists, otherwise null
    // (null indicates it's not in our list or interpretation is too contextual/complex for simple boolean)
    return trendInterpretation.hasOwnProperty(key) ? trendInterpretation[key] : null;
  }
  
  // --- Test cases ---
  console.log("----- Fundamentals -----");
  console.log("Revenues:", isIncreaseGenerallyPositive("Revenues")); // Output: true
  console.log("Long-term Debt:", isIncreaseGenerallyPositive("Long-term Debt")); // Output: false
  console.log("Net Cash Flow From Operating Activities:", isIncreaseGenerallyPositive("Net Cash Flow From Operating Activities")); // Output: true
  console.log("Inventory:", isIncreaseGenerallyPositive("Inventory")); // Output: false
  console.log("Diluted Average Shares:", isIncreaseGenerallyPositive("Diluted Average Shares")); // Output: false
  
  console.log("\n----- Technicals -----");
  console.log("Simple Moving Average:", isIncreaseGenerallyPositive("Simple Moving Average")); // Output: true
  console.log("Relative Strength Index:", isIncreaseGenerallyPositive("Relative Strength Index")); // Output: true (with nuance)
  console.log("MACD Value:", isIncreaseGenerallyPositive("MACD Value")); // Output: true
  console.log("MACD Signal:", isIncreaseGenerallyPositive("MACD Signal")); // Output: true
  console.log("MACD Histogram:", isIncreaseGenerallyPositive("MACD Histogram")); // Output: true
  
  console.log("\n----- Other -----");
  console.log("Some Unknown Key:", isIncreaseGenerallyPositive("Some Unknown Key")); // Output: null