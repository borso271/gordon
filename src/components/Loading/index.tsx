import React, { useState, useEffect } from "react";
import styles from "./Loading.module.css";
import { useLanguage } from "../../app/hooks/useLanguage";

interface LoadingProps {
  thinkingText?: string;
}

const Loading: React.FC<LoadingProps> = ({ thinkingText }) => {
  const [activeDot, setActiveDot] = useState<number>(0);
  const { currentLang } = useLanguage();

  // Use prop if provided, fallback to localized default
  const defaultText = currentLang === "en" ? "Thinking" : "يفكر";
  const displayText = thinkingText ?? defaultText;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <span className={styles.text}>{displayText}</span>
      <span className={styles.dots}>
        <span className={activeDot === 0 ? styles.activeDot : styles.dot}>.</span>
        <span className={activeDot === 1 ? styles.activeDot : styles.dot}>.</span>
        <span className={activeDot === 2 ? styles.activeDot : styles.dot}>.</span>
      </span>
    </div>
  );
};

export default Loading;

