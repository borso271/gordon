
export function assign_list_XYCoordinateTimestamp(dataPoints, start_time, end_time, width, min_price, max_price, height, offsetX = 0) {
    
    if (!dataPoints.length) return [];
    // console.log("OFFSET X IS: ", offsetX)
   
    // Edge case: No time range
    const timeRange = end_time === start_time ? null : (end_time - start_time);
    // Edge case: No price range
    const priceRange = max_price === min_price ? null : (max_price - min_price);
    const heightFactor = priceRange ? height / priceRange : null;
  
    return dataPoints.map(dp => ({
      ...dp,
      x: timeRange ? ((dp.time - start_time) / timeRange) * width + offsetX : (width / 2) + offsetX,
      y: priceRange ? height - ((dp.price - min_price) * heightFactor) : height / 2,
    }));
  }



  export function assign_singlepoint_XYCoordinateTimestamp(dataPoint, start_time, end_time, width, min_price, max_price, height, offsetX = 0) {
    let x, y;
  
    // Handle x coordinate assignment
    if (start_time === end_time) {
      x = width / 2 + offsetX; // Center if no time range
    } else {
      const normalizedTime = (dataPoint.time - start_time) / (end_time - start_time);
      x = (normalizedTime * width) + offsetX;
    }
  
    // Handle y coordinate assignment
    if (min_price === max_price) {
      y = height / 2; // Center if no price range
    } else {
      const normalizedPrice = (dataPoint.price - min_price) / (max_price - min_price);
      y = height - (normalizedPrice * height); // Flip y-axis (higher price = lower y)
    }
  
    return { ...dataPoint, x, y };
  }
  