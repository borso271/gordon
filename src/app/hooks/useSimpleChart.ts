import {  useMemo } from "react";

// import isMarketOpenNow from "../../utils/is_market_open_now";
import returnPriceLegendSegments from "../../components/DataDriven/SymbolChart/utils/compute_price_legend/return_price_legend_metadata";
import { assign_list_XYCoordinatesIndexSimple } from "../../components/DataDriven/SymbolChart/utils/compute_point_coordinates/compute_xy_index";

export function useSimpleChart(periodData: any, width: number, height: number) {

  const prices = periodData.map((d: any) => d.price);
  const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
  const dayMax = prices.length > 0 ? Math.max(...prices) : 0;

  const range = dayMax - dayMin;
  const padding = range * 0.15; 
  const adjustedHigh = dayMax + padding;
  const adjustedLow = Math.floor(dayMin - padding);

  const priceLegendSegments = useMemo(() => {
    return dayMin !== undefined && dayMax !== undefined
      ? returnPriceLegendSegments(adjustedLow, adjustedHigh)
      : [];
  }, [dayMin, dayMax]);

  const isPositiveChange = true;
  const finalPeriodData = useMemo(() => {
    
    // 1) Compute periodData coords
    const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
      periodData,
      width,
      adjustedLow,
      adjustedHigh,
      height,
      0,        // x-offset
      0         // y-offset
    );
  
    // 3) Merge the two
    return periodData_with_coos;
  
    // Add all relevant dependencies
  }, [
    periodData,
 
    adjustedLow,
    adjustedHigh,
    height,
    width,

  ]);

  const currentPrice = periodData[periodData.length-1].price;
  // ✅ Return everything needed by SymbolChart's rendering
  return {
   
   
    periodData,
    isPositiveChange,
    finalPeriodData,
    priceLegendSegments,
 
    adjustedLow,
    adjustedHigh,
    currentPrice
  };
}


