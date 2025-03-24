
export function extractTwoValues(inputString: string) {
    const pattern = /"([^"]+)":"/g; // Matches: `"any-key":"` capturing `any-key`
    let matches = [...inputString.matchAll(pattern)];
  
    if (matches.length === 0) {
        return ["", ""]; // No matches found
    }
  
    // Get first match index
    let firstMatchIndex = matches[0].index + matches[0][0].length;
    let firstValueEnd = matches[1] ? matches[1].index : inputString.length;
    let firstValue = inputString.slice(firstMatchIndex, firstValueEnd);
    let secondValue = "";
  
    if (matches.length > 1) {
        let secondMatchIndex = matches[1].index + matches[1][0].length;
        secondValue = inputString.slice(secondMatchIndex);
    }
  
    // Remove trailing `",` from firstValue
    firstValue = firstValue.replace(/",?$/, "");
  
    // Remove trailing `}"` from secondValue
    secondValue = secondValue.replace(/"}"?$/, "");
  
    return [firstValue, secondValue];
  }
  