const computeLastPrices = (data) => {
    return Array.from(data.entries()).map(([period, prices]) => {
      if (!prices || prices.length === 0) return null;
      const lastPrice = prices.reduce((earliest, current) => 
        current.time < earliest.time ? current : earliest
      ).price;
      return { period, last_price: lastPrice };
    }).filter(Boolean);
  };

  export default computeLastPrices