function returnPriceLegendSegments(adjustedLow: number, adjustedHigh: number, n: number = 15) {
  // Step size is simply the difference divided by (n - 1)
  const step = (adjustedHigh - adjustedLow) / (n - 1);

  // Generate the legend with conditional formatting
  const legend = Array.from({ length: n }, (_, index) => {
    const price = adjustedLow + step * index;

    // Convert to string and check total length (integer + decimals)
    const priceStr = price.toFixed(2);
    const strippedPrice = Math.round(price).toString(); // Rounded integer

    // If the price (including decimals) is longer than 5 digits, return integer only
    const formattedPrice = priceStr.replace(".", "").length > 5 ? strippedPrice : priceStr;

    return {
      index: index + 1,
      price: formattedPrice, // Price value
      label: formattedPrice, // Display label
    };
  });

  return legend;
}

export default returnPriceLegendSegments;
