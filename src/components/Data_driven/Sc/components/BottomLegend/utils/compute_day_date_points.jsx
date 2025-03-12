

// this should only have the hours, opening and end of stock market and never changes.
// for now ignore mobile and just return this.

// how to handle bitcoing vs stocks?
// if it is bitcoin, then it is different
const compute_day_date_points = (data, exchange_mic, asset_type, mobile) => {
    let timePoints = [];

    if (asset_type === "stock" && (exchange_mic === "XNAS" || exchange_mic === "XNYS")) {
        // US Stock Market Open: 9:30 AM ET - Close: 4:00 PM ET
        const openingHour = 9;
        const openingMinute = 30;
        const closingHour = 16; // 4:00 PM

        for (let hours = openingHour, minutes = openingMinute; hours < closingHour || (hours === closingHour && minutes === 0); ) {
            timePoints.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);

            // Increment by 30 minutes
            minutes += 30;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }
    } else if (asset_type === "crypto") {
        // Crypto: Generate times every 2 hours from 00:00 to 22:00
        for (let hours = 0; hours < 24; hours += 2) {
            timePoints.push(`${String(hours).padStart(2, '0')}:00`);
        }
    }

    return timePoints;
};


export default compute_day_date_points
