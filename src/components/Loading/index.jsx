import React, { useState, useEffect } from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  const [activeDot, setActiveDot] = useState(0); // 0 -> 1 -> 2 -> 0 (cycling)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <span className={styles.text}>Thinking</span>
      <span className={styles.dots}>
        <span className={activeDot === 0 ? styles.activeDot : styles.dot}>.</span>
        <span className={activeDot === 1 ? styles.activeDot : styles.dot}>.</span>
        <span className={activeDot === 2 ? styles.activeDot : styles.dot}>.</span>
      </span>
    </div>
  );
};

export default Loading;


// import React, { useState, useEffect } from "react";
// import styles from "./Loading.module.css";

// const Loading = () => {
//   const [dotCount, setDotCount] = useState(1);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDotCount((prev) => (prev % 3) + 1); // Cycle between 1 -> 2 -> 3 -> 1
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className={styles.loadingContainer}>
//       <span className={styles.text}>Thinking</span>
//       <span className={styles.dots}>
//         <span className={dotCount >= 1 ? styles.activeDot : styles.dot}>.</span>
//         <span className={dotCount >= 2 ? styles.activeDot : styles.dot}>.</span>
//         <span className={dotCount >= 3 ? styles.activeDot : styles.dot}>.</span>
//       </span>
//     </div>
//   );
// };

// export default Loading;
