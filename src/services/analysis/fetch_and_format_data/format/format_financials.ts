/*

1. Remove continuing entries
2. Remove useless entries
3. Format numbers in a readable way

...

Re-test chart and snapshot with new tables.
Re-test websockets (though nothing has really changed)

*/

/**
 * Recursively removes all subobjects where the key contains "Continuing".
 * @param {Object} data - The financial data object with nested labels.
 * @returns {Object} - A filtered object without "Continuing" labels.
 */
function removeContinuingLabelsRecursively(data) {
    if (!data || typeof data !== "object") return data; // Ensure valid object

    const cleanedData = {};

    for (const [key, value] of Object.entries(data)) {
        if (!key.includes("Continuing")) {
            // If the value is an object, apply the function recursively
            cleanedData[key] = typeof value === "object"
                ? removeContinuingLabelsRecursively(value)
                : value;
        }
    }

    return cleanedData;
}

/**
 * Recursively remove entries that have:
 *  - value: 0
 *  - one_quarter_trend: "N/A"
 *  - one_year_trend: "N/A"
 */

function removeIrrelevantEntries(data) {
  const irrelevantKeys = ["Wages", 'Net Income/Loss Attributable To Parent', 'Accounts Payable', 'Noncurrent Liabilities',
  'Net Income/Loss Available To Common Stockholders, Basic', 'Selling, General, and Administrative Expenses', "Equity Attributable To Parent", "Liabilities And Equity"]; // Add more exact matches here

  // If the data is an array, apply the function to each element.
  if (Array.isArray(data)) {
    return data.map(removeIrrelevantEntries);
  }

  // If the data is an object, walk through its keys.
  if (data && typeof data === 'object') {
    const cleaned = {};

    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

      // Skip if the key is irrelevant:
      if (
        key.startsWith("Other") ||
        irrelevantKeys.includes(key) ||
        key.endsWith("Deferred")
      ) {
        continue;
      }

      const value = data[key];

      // If it's a typical entry object with value + trends
      if (
        value &&
        typeof value === 'object' &&
        'value' in value &&
        'one_quarter_trend' in value &&
        'one_year_trend' in value
      ) {
        const isAllZeroOrNA =
          value.value === 0 &&
          value.one_quarter_trend === 'N/A' &&
          value.one_year_trend === 'N/A';

        if (!isAllZeroOrNA) {
          cleaned[key] = removeIrrelevantEntries(value);
        }
      } else {
        // Recurse on non-leaf nodes
        cleaned[key] = removeIrrelevantEntries(value);
      }
    }

    return cleaned;
  }

  // Base case: primitive value
  return data;
}


// function removeIrrelevantEntries(data) {
//     // If the data is an array, apply the function to each element.
//     if (Array.isArray(data)) {
//       return data.map(removeIrrelevantEntries);
//     }
    
//     // If the data is an object, walk through its keys.
//     if (data && typeof data === 'object') {
//       const cleaned = {};
//       for (const key in data) {
//         if (Object.prototype.hasOwnProperty.call(data, key)) {
//           const value = data[key];
          
//           // Check if it's a typical entry object with the 3 fields we care about.
//           if (
//             value &&
//             typeof value === 'object' &&
//             'value' in value &&
//             'one_quarter_trend' in value &&
//             'one_year_trend' in value
//           ) {
//             // If it's all zeros and 'N/A', omit it.
//             if (
//               !(
//                 value.value === 0 &&
//                 value.one_quarter_trend === 'N/A' &&
//                 value.one_year_trend === 'N/A'
//               )
//             ) {
//               cleaned[key] = removeIrrelevantEntries(value);
//             }
//           } else {
//             // Otherwise, just recurse normally on whatever this entry is.
//             cleaned[key] = removeIrrelevantEntries(value);
//           }
//         }
//       }
//       return cleaned;
//     }
//     // Base case: if it’s neither object nor array, just return the item as-is.
//     return data;
//   }
  
  // Example usage:
  // const cleanedData = removeIrrelevantEntries(originalJson);
  // console.log(JSON.stringify(cleanedData, null, 2));
  

  function formatLargeNumber(num) {
    if (Math.abs(num) < 1_000_000) return num.toString(); // If less than 1M, return as is.
  
    const units = ["Million", "Billion", "Trillion", "Quadrillion"];
    let unitIndex = 0;
    let divisor = 1_000_000; // Start at 1 million
  
    while (Math.abs(num) >= 1_000 * divisor && unitIndex < units.length - 1) {
      divisor *= 1_000;
      unitIndex++;
    }
  
    return `${num < 0 ? "-" : ""}${Math.round(Math.abs(num) / divisor)} ${units[unitIndex]}`;
  }
  
  // Example:
  // console.log(formatLargeNumber(344085000000)); // Output: "344 Billion"

  function transformJsonValues(data) {
    if (Array.isArray(data)) {
      return data.map(transformJsonValues);
    }
  
    if (data && typeof data === "object") {
      const transformed = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
  
          if (
            value &&
            typeof value === "object" &&
            "value" in value &&
            typeof value.value === "number"
          ) {
            // Transform 'value' field if it meets the criteria
            transformed[key] = {
              ...value,
              value: formatLargeNumber(value.value),
            };
          } else {
            // Recursively process nested objects
            transformed[key] = transformJsonValues(value);
          }
        }
      }
      return transformed;
    }
  
    return data;
  }
  
  // Example usage:
  // const cleanedJson = transformJsonValues(originalJson);
  // console.log(JSON.stringify(cleanedJson, null, 2));

  
  function removeKey<T extends Record<string, any>>(obj: T, keyToRemove: string): Partial<T> {
    const newObj: Partial<T> = {};
  
    for (const key in obj) {
      if (key !== keyToRemove) {
        newObj[key] = obj[key];
      }
    }
  
    return newObj;
  }
  

  function formatFinancialData(data){
    // remove continuining entries
    const data1 = removeContinuingLabelsRecursively(data)

    // remove irrelevant entries
    const data2 = removeIrrelevantEntries(data1)

    // format numberical values
    const data3 = transformJsonValues(data2)

    const data4 = removeKey(data3, "comprehensive_income")
  
    // return formatted result
    return data4

  }

  export default formatFinancialData