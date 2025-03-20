/*

In case it is intraday, use this,
while for the historic, also add the month case, since you might have the month case.


So you have two functions to write.


Now this:



*/




function compute_intraday_date_legend_metadata(start_ms, end_ms, n) {
    
    
    if (n < 2) throw new Error("n must be at least 2 for meaningful intervals");
    const step = (end_ms - start_ms) / (n-1); // Compute time interval between labels
    return Array.from({ length: n }, (_, index) => {
        const startTimeMs = Math.round(start_ms + index * step);
        const endTimeMs = Math.round(startTimeMs + step);

        const startTime = new Date(startTimeMs).toISOString();
        const endTime = new Date(endTimeMs).toISOString();

        return {
            index,
            start_time: startTime,
            end_time: endTime,
            start_time_ms: startTimeMs,
            end_time_ms: endTimeMs,
            label: formatTimeLabel(startTimeMs)
        };
    });
}

// Helper function to format time labels
function formatTimeLabel(timestampMs) {
    const date = new Date(timestampMs);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
   // // console.log("label is: ", `${hours}:${minutes.toString().padStart(2, '0')}`)
    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Ensures "9:30" instead of "9:3"
}

export default compute_intraday_date_legend_metadata;
