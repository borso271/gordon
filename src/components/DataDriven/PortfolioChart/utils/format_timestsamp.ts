
function formatTimestamp(timestamp: number | null | undefined): string {
  if (!timestamp) return "N/A";
  const date = new Date(
    timestamp < 1e12 ? timestamp * 1000 : timestamp // Convert to ms if it's in seconds
  );

  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export default formatTimestamp;


// function formatTimestamp(timestamp) {
//     if (!timestamp) return "N/A"; // Handle null/undefined/0 values
//     const date = new Date(timestamp); // Convert to milliseconds if timestamp is in seconds
//     return date.toLocaleString("en-US", {
//       month: "short", // "Feb", "Mar"
//       day: "2-digit", // "12"
//       hour: "2-digit", // "14"
//       minute: "2-digit", // "30"
//       hour12: false, // Use 24-hour format
//     }).replace(",", ""); // Remove comma for cleaner format
//   }
  
// export default formatTimestamp