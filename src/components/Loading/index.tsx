import React, { useState, useEffect } from "react";
import styles from "./Loading.module.css";

const Loading: React.FC = () => {
  const [activeDot, setActiveDot] = useState<number>(0); // Explicitly typed

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
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
