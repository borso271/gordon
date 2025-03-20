import React from "react";

const PercentageBar = ({ percentage }) => {
  const totalDots = 25;
  const filledDots = Math.round((percentage / 100) * totalDots); // Calculate how many dots should be filled

  return (
    <svg width={totalDots * 6} height="5" viewBox={`0 0 ${totalDots * 6} 5`} fill="none">
      {Array.from({ length: totalDots }).map((_, index) => (
        <circle
          key={index}
          cx={index * 6 + 3} /* Spacing circles evenly */
          cy="2.5"
          r="2.5"
          fill={index < filledDots ? "#b1f625" : "#232323"}
        />
      ))}
    </svg>
  );
};

export default PercentageBar;



/* example usage */
// import React from "react";
// import PercentageBar from "../components/Charts/PercentageBar";

// const Home = () => (
//   <div>
//     <h2>Example Progress</h2>
//     <PercentageBar percentage={50} /> {/* 50% should color 15 dots */}
//     <PercentageBar percentage={75} /> {/* 75% should color 22-23 dots */}
//     <PercentageBar percentage={90} /> {/* 90% should color 27 dots */}
//   </div>
// );

// export default Home;
