
import { chooseChartConfig } from "./compute_interval_and_n.js";
import computeDateMetaData from "./compute_date_legend_metadata.js";


  function returnDateLegendSegments(period, assetType,start_ms, end_ms, dataPoints) {
    //console.log("RETURN DATE LEGEND SEGMENTS INPUTS are: ", period, assetType,start_ms, end_ms, dataPoints)
    const {interval, n} = chooseChartConfig(period, "large", assetType)
    // console.log("interval and n are: ", interval, n)
    //// console.log("interval and n are: ", interval, n)
    // dataPoints, interval,start_ms, end_ms, n
   // console.log("interval and n are: ", interval, n)

    const segments = computeDateMetaData(dataPoints, interval,period, start_ms, end_ms,n);
    return segments

  }

  export default returnDateLegendSegments

  // // console.log(segments)
  // example output:
  // [
  //   {
  //     index: 0,
  //     start_time: '2025-01-02T09:30:00.000Z',
  //     end_time: '2025-01-02T12:00:00.000Z',
  //     start_time_ms: 1735810200000,
  //     end_time_ms: 1735819200000
  //   },
  //   {
  //     index: 1,
  //     start_time: '2025-01-02T12:00:00.000Z',
  //     end_time: '2025-01-02T14:30:00.000Z',
  //     start_time_ms: 1735819200000,
  //     end_time_ms: 1735828200000
  //   },
  //   {
  //     index: 2,
  //     start_time: '2025-01-02T14:30:00.000Z',
  //     end_time: '2025-01-02T17:00:00.000Z',
  //     start_time_ms: 1735828200000,
  //     end_time_ms: 1735837200000
  //   },
  //   {
  //     index: 3,
  //     start_time: '2025-01-02T17:00:00.000Z',
  //     end_time: '2025-01-02T19:30:00.000Z',
  //     start_time_ms: 1735837200000,
  //     end_time_ms: 1735846200000
  //   },
  //   {
  //     index: 4,
  //     start_time: '2025-01-02T19:30:00.000Z',
  //     end_time: '2025-01-02T22:00:00.000Z',
  //     start_time_ms: 1735846200000,
  //     end_time_ms: 1735855200000
  //   },
  //   {
  //     index: 5,
  //     start_time: '2025-01-02T22:00:00.000Z',
  //     end_time: '2025-01-03T00:30:00.000Z',
  //     start_time_ms: 1735855200000,
  //     end_time_ms: 1735864200000
  //   },
  //   {
  //     index: 6,
  //     start_time: '2025-01-03T00:30:00.000Z',
  //     end_time: '2025-01-03T00:30:00.000Z',
  //     start_time_ms: 1735864200000,
  //     end_time_ms: 1735864200000
  //   },
  //   {
  //     index: 7,
  //     start_time: '2025-01-03T00:30:00.000Z',
  //     end_time: '2025-01-03T03:00:00.000Z',
  //     start_time_ms: 1735864200000,
  //     end_time_ms: 1735873200000
  //   },
  //   {
  //     index: 8,
  //     start_time: '2025-01-03T03:00:00.000Z',
  //     end_time: '2025-01-03T05:30:00.000Z',
  //     start_time_ms: 1735873200000,
  //     end_time_ms: 1735882200000
  //   },
  //   {
  //     index: 9,
  //     start_time: '2025-01-03T05:30:00.000Z',
  //     end_time: '2025-01-03T08:00:00.000Z',
  //     start_time_ms: 1735882200000,
  //     end_time_ms: 1735891200000
  //   },
  //   {
  //     index: 10,
  //     start_time: '2025-01-03T08:00:00.000Z',
  //     end_time: '2025-01-03T10:30:00.000Z',
  //     start_time_ms: 1735891200000,
  //     end_time_ms: 1735900200000
  //   },
  //   {
  //     index: 11,
  //     start_time: '2025-01-03T10:30:00.000Z',
  //     end_time: '2025-01-03T13:00:00.000Z',
  //     start_time_ms: 1735900200000,
  //     end_time_ms: 1735909200000
  //   },
  //   {
  //     index: 12,
  //     start_time: '2025-01-03T13:00:00.000Z',
  //     end_time: '2025-01-03T15:30:00.000Z',
  //     start_time_ms: 1735909200000,
  //     end_time_ms: 1735918200000
  //   }
  // ]


  /*
  Go back to the general strategy.

  */