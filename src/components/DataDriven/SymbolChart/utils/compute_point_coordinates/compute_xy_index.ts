/*

Now give me a function that given the enriched list
*/

import { IndexedDataPoint, DataPointWithXY, DataPointBase } from "../../../../../interfaces";

export function assign_list_XYCoordinatesIndex(
  dataPoints: IndexedDataPoint[],
  n: number,
  width: number,
  min_price: number,
  max_price: number,
  height: number,
  yoffset: number
): DataPointWithXY[] {
  if (!dataPoints.length) return [];

  const priceRange = max_price === min_price ? null : (max_price - min_price);
  const heightFactor = priceRange ? height / priceRange : null;

  return dataPoints.map(point => {
    let x: number | null = null;
    let y = height / 2;

    if (
      point.slot_index !== null &&
      point.slot_max !== null &&
      point.slot_position !== null
    ) {
      x =
        (point.slot_index * width) / n +
        (width / (n * point.slot_max)) * point.slot_position;
    }

    if (priceRange && heightFactor !== null) {
      y = yoffset + height - (point.price - min_price) * heightFactor;
    }

    return { ...point, x, y };
  });
}


export function assign_list_XYCoordinatesIndexSimple(
  dataPoints: DataPointBase[],
  width: number,
  min_price: number,
  max_price: number,
  height: number,
  xoffset: number,
  yoffset: number
): DataPointWithXY[] {
  if (!dataPoints.length) return [];

  const n = dataPoints.length;
  const priceRange = max_price === min_price ? null : max_price - min_price;
  const heightFactor = priceRange ? height / priceRange : null;

  return dataPoints.map((point, index) => {
    const x = xoffset + ((index / (n - 1)) * width);

    let y = height / 2;
    if (priceRange && heightFactor !== null) {
      y = yoffset + height - (point.price - min_price) * heightFactor;
    }

    return { ...point, x, y };
  });
}



  // export function assign_list_XYCoordinatesIndex(dataPoints, n, width, min_price, max_price, height, yoffset) {
 
  //   if (!dataPoints.length) return [];
  
  //   // Edge case: Avoid division by zero for y-coordinates
  //   const priceRange = max_price === min_price ? null : (max_price - min_price);
  //   const heightFactor = priceRange ? height / priceRange : null;
    
  //   return dataPoints.map(point => {
      
  //     let x = null;
  //     let y = height / 2; // Default y position (center) if price range is zero
  
  //     // Assign x coordinate using slot-based logic
  //     if (point.slot_index !== null && point.slot_max !== null && point.slot_position !== null) {
  //       x = (((point.slot_index) * width / n) + (width / (n * point.slot_max)) * point.slot_position);
  //     }
  
  //     // Assign y coordinate using standard logic
  //     if (priceRange) {
  //       y = yoffset+ height - ((point.price - min_price) * heightFactor);
  //     }
  
  //     return { ...point, x, y };
  //   });

  // }

  // export function assign_list_XYCoordinatesIndexSimple(dataPoints, width, min_price, max_price, height, xoffset,yoffset) {
 
  //   if (!dataPoints.length) return [];
  
  //   const n = dataPoints.length; // Number of data points
  //   const priceRange = max_price === min_price ? null : max_price - min_price;
  //   const heightFactor = priceRange ? height / priceRange : null;
  
  //   return dataPoints.map((point, index) => {
  //     // X coordinate based only on index
  //     const x = xoffset+ ((index / (n - 1)) * width); // Spread indices evenly across the width
  
  //     // Y coordinate based on price
  //     let y = height / 2; // Default y position (center) if price range is zero
  //     if (priceRange) {
  //       y = yoffset + height - ((point.price - min_price) * heightFactor);
  //     }
  
  //     return { ...point, x, y };
  //   });
  // }
  
  