

function isMarketOpenNow(asset_type, exchange_mic=null) {

    if (asset_type == "crypto"){
        return true
    }
    else if (exchange_mic == "XNAS" || exchange_mic=="XNYS"){
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-based
    const day = now.getDate();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
 

    // Convert current time to Eastern Time (ET)
    const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const estHours = estNow.getHours();
    const estMinutes = estNow.getMinutes();

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
        return { open: false, message: "Stock market is closed on weekends." };
    }

    // Market is closed on holidays
    if (marketHolidays.includes(dateKey)) {
        return { open: false, message: "Stock market is closed due to a holiday." };
    }

    // Trading hours
    const regularOpenTime = { hour: 9, minute: 30 };
    const regularCloseTime = { hour: 16, minute: 0 };
    const earlyCloseTime = { hour: 13, minute: 0 };

    // Check if today is an early closure day
    const marketCloseTime = earlyClosureDays.includes(dateKey) ? earlyCloseTime : regularCloseTime;

    // Check if the market is currently open
    const isOpenNow =
        (estHours > regularOpenTime.hour || (estHours === regularOpenTime.hour && estMinutes >= regularOpenTime.minute)) &&
        (estHours < marketCloseTime.hour || (estHours === marketCloseTime.hour && estMinutes < marketCloseTime.minute));

    return {
        open: isOpenNow,
        message: isOpenNow ? "Stock market is currently open." : "Stock market is currently closed.",
        trading_hours: earlyClosureDays.includes(dateKey) ? "9:30 AM - 1:00 PM ET" : "9:30 AM - 4:00 PM ET"
    };
}
return false;
}

// Example usage
// console.log(is_us_stock_market_open_now());
export default isMarketOpenNow



// console.log(isMarketOpenNow())