/*
this takes an offset width,
a start time, and end time (in unix ms), and assign an x coordinate to the point based on this.
*/

import { DataPoint,DataPointWithX } from "../../../../../app/interfaces";

export function assignXCoordinateByTime(
  dataPoint: DataPoint,
  start_time: number,
  end_time: number,
  width: number,
  offset: number = 0
): DataPointWithX {
  if (start_time === end_time) {
    return { ...dataPoint, x: width / 2 + offset };
  }

  const normalizedTime = (dataPoint.timestamp - start_time) / (end_time - start_time);
  const x = normalizedTime * width + offset;
  return { ...dataPoint, x };
}


export function assignXCoordinatesByTime(
  dataPoints: DataPoint[],
  start_time: number,
  end_time: number,
  width: number,
  offset: number = 0
): DataPointWithX[] {
  if (!dataPoints.length) return [];

  if (start_time === end_time) {
    return dataPoints.map((point) => ({ ...point, x: width / 2 + offset }));
  }

  const timeRange = end_time - start_time;
  return dataPoints.map((point) => ({
    ...point,
    x: ((point.timestamp- start_time) / timeRange) * width + offset
  }));
}


// export function assignXCoordinateByTime(dataPoint, start_time, end_time, width, offset = 0) {
//   if (start_time === end_time) {
//     return { ...dataPoint, x: width / 2 + offset }; // Center if no range
//   }

//   // Normalize the timestamp between start_time and end_time
//   const normalizedTime = (dataPoint.timestamp_ms - start_time) / (end_time - start_time);

//   // Convert to x coordinate
//   const x = (normalizedTime * width) + offset;

//   return { ...dataPoint, x };
// }


// // do it for all in a list,

// export function assignXCoordinatesByTime(dataPoints, start_time, end_time, width, offset = 0) {
//   if (!dataPoints.length) return [];

//   if (start_time === end_time) {
//     // If no time range, assign all points to the center
//     return dataPoints.map((point) => ({ ...point, x: width / 2 + offset }));
//   }
//   const timeRange = end_time - start_time;
//   return dataPoints.map((point) => ({
//     ...point,
//     x: ((point.timestamp_ms - start_time) / timeRange) * width + offset
//   }));
// }

