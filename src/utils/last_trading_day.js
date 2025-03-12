function is_us_stock_market_open_on_date(month, day, year) {
    const date = new Date(year, month - 1, day); // month is 1-based, JS Date is 0-based
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    // List of holidays when the stock market is closed
    const marketHolidays = [
        "1-1",   // New Year's Day
        "1-20",  // Martin Luther King Jr. Day (2025)
        "2-17",  // Presidents' Day (2025)
        "4-18",  // Good Friday (2025)
        "5-26",  // Memorial Day (2025)
        "6-19",  // Juneteenth National Independence Day
        "7-4",   // Independence Day
        "9-1",   // Labor Day (2025)
        "11-27", // Thanksgiving Day (2025)
        "12-25"  // Christmas Day
    ];

    // List of early closure days (market closes at 1 PM ET)
    const earlyClosureDays = [
        "7-3",   // Day before Independence Day
        "11-28", // Day after Thanksgiving (Black Friday)
        "12-24"  // Christmas Eve
    ];

    const dateKey = `${month}-${day}`; // Convert to MM-DD format

    // Market is closed on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }

    // Market is closed on holidays
    if (marketHolidays.includes(dateKey)) {
        return false;
    }

    // Market closes early on specified early closure days
    if (earlyClosureDays.includes(dateKey)) {
        return true; // Still open, but with limited hours
    }

    // Regular trading day
    return true;
}

// Example usage

// console.log(is_us_stock_market_open_on_date(3, 7, 2025));  // true (early close)
// console.log(is_us_stock_market_open_on_date(4, 7, 2025));  // false (Independence Day)
// console.log(is_us_stock_market_open_on_date(25, 12, 2025)); // false (Christmas)
// console.log(is_us_stock_market_open_on_date(20, 10, 2025)); // true (Regular trading day)


function get_last_trading_day() {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // JavaScript months are 0-based
    let year = today.getFullYear();

    let lastTradingDate = new Date(year, month - 1, day); // Start from today

    do {
        // Move back one day
        lastTradingDate.setDate(lastTradingDate.getDate() - 1);

        // Extract new day, month, and year
        day = lastTradingDate.getDate();
        month = lastTradingDate.getMonth() + 1;
        year = lastTradingDate.getFullYear();
    } while (!is_us_stock_market_open_on_date(day, month, year)); // Keep moving back until we find an open day

    return lastTradingDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Example usage
// console.log(get_last_trading_day());

export default get_last_trading_day