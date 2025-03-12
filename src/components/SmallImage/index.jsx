import React from "react";
import styles from "./SmallImage.module.css"; // Custom CSS module

const SmallImage = ({ url, alt, x }) => {
  return (
    <div className={styles.imageContainer} style={{ width: x, height: x }}>
      <img src={url} alt={alt} className={styles.image} />
    </div>
  );
};

export default SmallImage;
