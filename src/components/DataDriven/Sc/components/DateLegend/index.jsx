


const TimeLegend = ({ width, timeRanges, marketOpen, period,intradayPercentage }) => {
  if (!timeRanges || timeRanges.length === 0) return null;
  

  /* first thing handle the legend: marketOpen, period */

  const MIN_WIDTH_THRESHOLD = 600; // 🔥 Adjust this value as needed
  const totalLabels = timeRanges.length;
  const labelSpacing = 100 / totalLabels; // 🔥 Compute spacing in %
 

  const wp = (1 - intradayPercentage);
  // console.log("wp is: ", wp)


  return (
    <svg width="100%"  height="40" xmlns="http://www.w3.org/2000/svg">
      {timeRanges.map(({ index, label }) => {
        // ❌ Always hide first label
        if (index === 0) return null;
        
        // ❌ If width is too small, hide even-indexed labels
        if (width < MIN_WIDTH_THRESHOLD && index % 2 === 0) return null;

        // 🔥 Compute x position as a percentage
        const normalizedX = `${(index * labelSpacing)}%`; // Center within its section the *wp option on old, add a part

        return (
          <text 
          key={index}
          x={normalizedX} // ✅ Correctly positions text horizontally
          y="15"
          fontSize="12"
          textAnchor="middle" // ✅ Centers text at the computed position
          dominantBaseline="hanging"
          fill="#757575" /* ✅ Corrected: Use fill instead of color */
          fontFamily="Inter" /* ✅ Corrected: Use = instead of : */
        >
          {label}
        </text>
        
        );
      })}
    </svg>
  );
};

export default TimeLegend;


// get fresh historical data before retesting the chart.

// Actually, the nice thing would be for there always being labels at the same positions...
// but you might check with the canvas assignment of coordinates how it works.