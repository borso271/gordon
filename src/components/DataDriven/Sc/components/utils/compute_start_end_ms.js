/*
You are also using the start and end milliseconds.

Should they also be fixed dates? Probably so, and also determines what you fetch from the database.
Since inside a slot it is always index-based,
you might use fixed times.

But for the stocks and exhcanges you need to have opening and end hours (intraday)



Next this to write: compute_start_end_ms.
Then try the date legend.

... ... ...
For the intraday you really have to precompute your data ranges, no need to compute then using a function.

... ... ...

*/



// have a dictionary with the exchange mics in a list (since they may have the same, and the start and ending
// date, you also need the reference though, about the day.
// like you have the day, get the most recent data, check the day, use that date, but put in hardcored data)
// since each should actually be a date... 

const ranges = {
    0: { open: 9.5, close: 16 } // Stock market hours in decimal (9:30 AM to 4:00 PM)
};

const exchange_hours = {
    XNAS: 0, // Maps exchange to range index
};

// Function to get midnight timestamp
function getMidnightTimestamp(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
}

// Function to compute start and end timestamps
function compute_start_end_ms(period, asset_type, exchange_mic, lastTimeStamp) {
    // // console.log("compute start and end ms inputs are: ", period, asset_type, exchange_mic, lastTimeStamp)
    const lastDate = new Date(lastTimeStamp);
    let startDate = new Date(lastTimeStamp);
    let endDate = new Date(lastTimeStamp);

    // Determine the number of days for the period
    const daysMap = {
        "1D": 1,
        "1W": 7,
        "1M": 30,
        "1Y": 365,
        "5Y": 365 * 5,
    };

    if (!(period in daysMap)) {
        throw new Error("Invalid period provided");
    }

    const daysOffset = daysMap[period];

    if (asset_type === "crypto") {
        // Crypto assets use full days (midnight to midnight)
        startDate.setUTCDate(lastDate.getUTCDate() - daysOffset);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
    } else {
        // Get exchange market hours
        const rangeIndex = exchange_hours[exchange_mic];
        if (rangeIndex === undefined) {
            console.warn("Exchange MIC not recognized, using default market hours.");
        }

        const marketOpenHour = ranges[rangeIndex]?.open ?? 9.5;  // Default 9:30 AM
        const marketCloseHour = ranges[rangeIndex]?.close ?? 16; // Default 4:00 PM

        if (period === "1D") {
            // Fix: Both start & end should be the same day
            startDate.setUTCHours(Math.floor(marketOpenHour), (marketOpenHour % 1) * 60, 0, 0);
            endDate.setUTCHours(Math.floor(marketCloseHour), (marketCloseHour % 1) * 60, 0, 0);
        } else {
            // Compute start date (n days before)
            startDate.setUTCDate(lastDate.getUTCDate() - daysOffset);
            startDate.setUTCHours(Math.floor(marketOpenHour), (marketOpenHour % 1) * 60, 0, 0);

            // Compute end date (market close time, on the latest available day)
            endDate.setUTCHours(Math.floor(marketCloseHour), (marketCloseHour % 1) * 60, 0, 0);
        }
    }

    const obj = {
        start_ms: startDate.getTime(),
        end_ms: endDate.getTime()
    };

  //  // console.log("OBJ IS: ", obj);
    return obj;
}

export default compute_start_end_ms;
