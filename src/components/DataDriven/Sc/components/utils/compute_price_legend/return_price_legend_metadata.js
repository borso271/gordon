
// function returnPriceLegendSegments(adjustedLow, adjustedHigh, n = 15) {


//   // Determine a properly rounded step size
//   const rawStep = (adjustedHigh - adjustedLow) / (n - 1);
//   const step = Math.pow(10, Math.floor(Math.log10(rawStep))); // Round to nearest 10, 100, etc.

//   // **Fix: Ensure the step aligns properly with adjustedLow**
//   const roundedStep = Math.ceil(rawStep / step) * step;

//   // **Fix: Start directly at adjustedLow instead of rounding it further**
//   const legend = Array.from({ length: n }, (_, index) => {
//     const price = adjustedLow + roundedStep * index; // 🔥 Start at `adjustedLow`
//     return {
//       index: index + 1,
//       price: price.toFixed(2), // Ensure ".00" format
//       label: price.toFixed(2), // Same format for label
//     };
//   });

//   // console.log("Legend is:", legend);
//   return legend;
// }

function returnPriceLegendSegments(adjustedLow, adjustedHigh, n = 15) {
  // Step size is simply the difference divided by (n - 1)
  const step = (adjustedHigh - adjustedLow) / (n - 1);

  // Generate the legend without extra rounding
  const legend = Array.from({ length: n }, (_, index) => {
    const price = adjustedLow + step * index;
    return {
      index: index + 1,
      price: price.toFixed(2), // Keep up to 2 decimal places
      label: price.toFixed(2), // Same format for label
    };
  });

  // console.log("Legend is:", legend);
  return legend;
}



export default returnPriceLegendSegments;

// Example usage

// nice and used for the label.
