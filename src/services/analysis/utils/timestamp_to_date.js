function convertTimestampToDate(timestamp) {
    if (!timestamp) return "N/A"; // Handle null or undefined values

    // Check if timestamp is already in milliseconds (length > 10)
    const isMilliseconds = timestamp > 9999999999;
    const correctedTimestamp = isMilliseconds ? timestamp : timestamp * 1000;

    const date = new Date(correctedTimestamp);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export default convertTimestampToDate;
