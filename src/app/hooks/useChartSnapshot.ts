import { useEffect, useState } from "react";

export function useChartSnapshot(latestPrice: number | null, lastClose: number | null) {
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [iconSize, setIconSize] = useState<number>(window.innerWidth < 768 ? 46 : 60);

  useEffect(() => {
    if (latestPrice !== null && lastClose) {
      const change = ((latestPrice - lastClose) / lastClose) * 100;
      setPercentageChange(change);
    }
  }, [latestPrice, lastClose]);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 768 ? 46 : 60);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeClass = percentageChange !== null && percentageChange >= 0 ? "positive" : "negative";
  const trendIcon = percentageChange !== null && percentageChange >= 0 ? "positive_trend" : "negative_trend";

  return {
    percentageChange,
    changeClass,
    trendIcon,
    iconSize,
  };
}
