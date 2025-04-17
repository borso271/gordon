import { Period, PricePoint, LastPriceResult, PriceDataMap } from "../../../../interfaces";

const computeLastPrices = (data: PriceDataMap): LastPriceResult[] => {
  return Array.from(data.entries())
    .map(([period, prices]) => {
      if (!prices || prices.length === 0) return null;

      const lastPrice = prices.reduce((earliest, current) =>
        current.time < earliest.time ? current : earliest
      ).price;

      return { period, last_price: lastPrice };
    })
    .filter((entry): entry is LastPriceResult => Boolean(entry)); // narrow type from (LastPriceResult | null)[]
};

export default computeLastPrices;

// const computeLastPrices = (data) => {
//   return Array.from(data.entries()).map(([period, prices]) => {
//     if (!prices || prices.length === 0) return null;
//     const lastPrice = prices.reduce((earliest, current) => 
//       current.time < earliest.time ? current : earliest
//     ).price;
//     return { period, last_price: lastPrice };
//   }).filter(Boolean);
// };

// export default computeLastPrices