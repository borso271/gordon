function formatTimestamp(timestamp) {
    if (!timestamp) return "N/A"; // Handle null/undefined/0 values
  
    const date = new Date(timestamp); // Convert to milliseconds if timestamp is in seconds
  
    return date.toLocaleString("en-US", {
      month: "short", // "Feb", "Mar"
      day: "2-digit", // "12"
      hour: "2-digit", // "14"
      minute: "2-digit", // "30"
      hour12: false, // Use 24-hour format
    }).replace(",", ""); // Remove comma for cleaner format
  }
  
export default formatTimestamp