/*

here perhaps you want to assign to each point, since you need it also for the new points.

Here suppose you have a min y and max y, though it would be nice to recompute the y coordinate,

You recompute when the day min or day max change that would not be that often.

In general you have.

*/

export function assignYCoordinate(dataPoint, min_price, max_price, height) {
    if (min_price === max_price) {
      return { ...dataPoint, y: height / 2 }; // Avoid division by zero, center it
    }
  
    // Normalize the price between min_price and max_price
    const normalizedPrice = (dataPoint.price - min_price) / (max_price - min_price);
  
    // Convert to y coordinate (invert since y=0 is top in most canvas systems)
    const y = height - (normalizedPrice * height);
  
    return { ...dataPoint, y };
  }
  
  export function assignYCoordinates(dataPoints, min_price, max_price, height) {
    if (min_price === max_price) {
      // Avoid division by zero: Assign the middle y position to all points
      return dataPoints.map(dp => ({ ...dp, y: height / 2 }));
    }
  
    // Precompute height factor to avoid redundant calculations
    const heightFactor = height / (max_price - min_price);
  
    // Map over the list and compute y for each data point
    return dataPoints.map(dp => ({
      ...dp,
      y: height - ((dp.price - min_price) * heightFactor),
    }));
  }
  
  export default assignYCoordinates;
  



  
  