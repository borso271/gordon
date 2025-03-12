/*

this takes as input:

- PERIOD
- DATA

They actually are more functions, that you need to use...

Legend data needs price data.


How should the flow go from the chart...

1. GET THE HISTORICAL DATA: series data, asset_type.
2. GET THE INTRADAY DATA: series data.
3. Compute min and max, and set up recall when they change.
4. Compute the date legend metadata.
5. Compute the price legend metadata.
6. Compute the historical data coordinates (never change)
7. Compute the intraday data coordinates you already have.
8. Render the chart.

9. Add points to the chart if the market is open.

------------

How to handle bitcoin?
If you want a unified thing, for cryptos, what you might want to do is always to get only the data after midnight
in the intraday data, rather than all the data, and then clean when it should be clean.
You might also do it so that you store less points than for stock. Say one every 30 seconds for now,
that is 3000 entries for a day. For 10 cryptos is ok.


------------


The function to assign x and y needs the legend data.
returns:
- LEGEND 1 DATA (to be used by the component)
- LEGEND 2 DATA (to be used by the component)
- FUNCTION TO ENRICH HISTORICAL POINTS WITH X AND Y COORDINATES (a function that just handle historical data to set up a chart)
- FUNCTION TO ENRICH INTRADAY POINTS I ALREADY HAVE WITH X AND Y COORDINATES
- FUNCTION TO GIVE TO A NEW SINGLE DATA POINT its X, and its Y (for newly coming point the x and y should be computed and they should be ADDED TO THE PATH IN THEIR SLOT)

*/

/*

what about stock market

*/

/*
If the market is closed, the intraday is also all historical?
*/

function returnSetupData(period, dataPoints, totalWidth, asset_type, marketOpen) {
    let historicalPartWidth = 0;
    let dayPartWidth = 0;

    switch (period) {
        case "1D":
            if (!marketOpen) {
                historicalPartWidth = 0;
                dayPartWidth = totalWidth;
            } else {
                historicalPartWidth = 0;
                dayPartWidth = totalWidth;
            }
            break;

        case "1W":
            if (!marketOpen) {
                historicalPartWidth = totalWidth;
                dayPartWidth = 0;
            } else {
                if (asset_type === "stock") {
                    historicalPartWidth = (5 / 6) * totalWidth;
                    dayPartWidth = (1 / 6) * totalWidth;
                } else if (asset_type === "crypto") {
                    historicalPartWidth = (7 / 8) * totalWidth;
                    dayPartWidth = (1 / 8) * totalWidth;
                }
            }
            break;

        case "1M":
            if (!marketOpen) {
                historicalPartWidth = totalWidth;
                dayPartWidth = 0;
            } else {
                historicalPartWidth = (29 / 30) * totalWidth;
                dayPartWidth = (1 / 30) * totalWidth;
            }
            break;

        case "1Y":
            if (!marketOpen) {
                historicalPartWidth = totalWidth;
                dayPartWidth = 0;
            } else {
                historicalPartWidth = (364 / 365) * totalWidth;
                dayPartWidth = (1 / 365) * totalWidth;
            }
            break;

        case "5Y":
            if (!marketOpen) {
                historicalPartWidth = totalWidth;
                dayPartWidth = 0;
            } else {
                historicalPartWidth = (999 / 1000) * totalWidth;
                dayPartWidth = (1 / 1000) * totalWidth;
            }
            break;

        default:
            console.warn("Invalid period specified.");
            historicalPartWidth = totalWidth;
            dayPartWidth = 0;
            break;
    }

    return { historicalPartWidth, dayPartWidth };
}


/* come on you are almost there
*/