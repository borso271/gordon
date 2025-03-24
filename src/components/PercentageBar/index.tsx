import React from "react";

interface PercentageBarProps {
  percentage: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({ percentage }) => {
  const totalDots = 25;
  const filledDots = Math.round((percentage / 100) * totalDots);

  return (
    <svg width={totalDots * 6} height={5} viewBox={`0 0 ${totalDots * 6} 5`} fill="none">
      {Array.from({ length: totalDots }).map((_, index) => (
        <circle
          key={index}
          cx={index * 6 + 3}
          cy={2.5}
          r={2.5}
          fill={index < filledDots ? "#b1f625" : "#232323"}
        />
      ))}
    </svg>
  );
};

export default PercentageBar;
