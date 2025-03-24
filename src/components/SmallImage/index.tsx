import React from "react";
import styles from "./SmallImage.module.css";

interface SmallImageProps {
  url: string;
  alt: string;
  x: number | string; // e.g., "50px" or 50
}

const SmallImage: React.FC<SmallImageProps> = ({ url, alt, x }) => {
  return (
    <div className={styles.imageContainer} style={{ width: x, height: x }}>
      <img src={url} alt={alt} className={styles.image} />
    </div>
  );
};

export default SmallImage;
