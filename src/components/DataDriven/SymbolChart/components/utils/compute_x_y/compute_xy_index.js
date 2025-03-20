/*

Now give me a function that given the enriched list
*/


function addPointsToSegments(list1, list2) {
  return list2.map(segment => ({
    ...segment,
    points: list1.filter(point =>
      point.timestamp_ms >= segment.start_time_ms &&
      point.timestamp_ms < segment.end_time_ms
    )
  }));
}

export function assignSlotsToPoints(list1, list2) {
    // First, create a map to store slot positions
    const slotMap = new Map();

    // Initialize an empty array for each slot
    list2.forEach(slot => slotMap.set(slot.index, []));
  
    // Assign each data point to its slot
    list1.forEach(point => {
      const slot = list2.find(slot =>
        point.time >= slot.start_time_ms &&
        point.time < slot.end_time_ms
      );
  
      if (slot) {
        slotMap.get(slot.index).push(point);
      }
    });

    // Now, modify each point to include slot_index, slot_position, and slot_max
    const updatedList1 = list1.map(point => {
      const slot = list2.find(slot =>
        point.time >= slot.start_time_ms &&
        point.time < slot.end_time_ms
      );
  
      if (!slot) {
        return { ...point, slot_index: null, slot_position: null, slot_max: null };
      }
  
      // Get all points in this slot
      const slotPoints = slotMap.get(slot.index);
      
      return {
        ...point,
        slot_index: slot.index,
        slot_position: slotPoints.indexOf(point) + 1, // 1-based position
        slot_max: slotPoints.length, // Total count of points in this slot
      };
    });
  
    return updatedList1;
  }
  
  function assignXCoordinates(dataPoints, n, width) {
    return dataPoints.map(point => {
      if (point.slot_index === null || point.slot_max === null || point.slot_position === null) {
        return { ...point, x: null }; // Skip if point is not assigned to a valid slot
      }
  
      const x = (point.slot_index * width / n) + (width / (n * point.slot_max)) * point.slot_position;
      return { ...point, x };
    });
  }
  
  // so you assign the x coordinates to the points...
  // when the min and max changes, you recompute and you change the whole thing, but you re-render only when the computation is completed.



  // const priceRange = max_price === min_price ? null : (max_price - min_price);
  //   const heightFactor = priceRange ? height / priceRange : null;
  
  //   return dataPoints.map(dp => ({
  //     ...dp,
  //     x: timeRange ? ((dp.time - start_time) / timeRange) * width + offsetX : (width / 2 + offsetX),
  //     y: priceRange ? height - ((dp.price - min_price) * heightFactor) : height / 2,
  //   }));
  // }


  export function assign_list_XYCoordinatesIndex(dataPoints, n, width, min_price, max_price, height, yoffset) {
    //// console.log("assign list xy coos inputs are: ", dataPoints, n, width, min_price, max_price, height)
   
    if (!dataPoints.length) return [];
  
    // Edge case: Avoid division by zero for y-coordinates
    const priceRange = max_price === min_price ? null : (max_price - min_price);
    const heightFactor = priceRange ? height / priceRange : null;
    
    return dataPoints.map(point => {
      
      let x = null;
      let y = height / 2; // Default y position (center) if price range is zero
  
      // Assign x coordinate using slot-based logic
      if (point.slot_index !== null && point.slot_max !== null && point.slot_position !== null) {
        x = (((point.slot_index) * width / n) + (width / (n * point.slot_max)) * point.slot_position);
      }
  
      // Assign y coordinate using standard logic
      if (priceRange) {
        y = yoffset+ height - ((point.price - min_price) * heightFactor);
      }
  
      return { ...point, x, y };
    });

  }





  // const todayData_With_Coos = assign_list_XYCoordinatesIndexSimple(todayData, intradaywidth, adjustedLow, adjustedHigh, chartDimensions.height, offsetX)


  export function assign_list_XYCoordinatesIndexSimple(dataPoints, width, min_price, max_price, height, xoffset,yoffset) {
    // console.log("WIDTH IS: ", width)
    // console.log("OFFSETyyyy IS: ", yoffset)
    if (!dataPoints.length) return [];
  
    const n = dataPoints.length; // Number of data points
    const priceRange = max_price === min_price ? null : max_price - min_price;
    const heightFactor = priceRange ? height / priceRange : null;
  
    return dataPoints.map((point, index) => {
      // X coordinate based only on index
      const x = xoffset+ ((index / (n - 1)) * width); // Spread indices evenly across the width
  
      // Y coordinate based on price
      let y = height / 2; // Default y position (center) if price range is zero
      if (priceRange) {
        y = yoffset + height - ((point.price - min_price) * heightFactor);
      }
  
      return { ...point, x, y };
    });
  }
  
  