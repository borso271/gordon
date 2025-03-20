export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//   // Example usage:
//   console.log(formatNumberWithCommas(96157.03)); // Output: "96,157.03"
  