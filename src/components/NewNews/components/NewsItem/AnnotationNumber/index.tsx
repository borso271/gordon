import React from "react";
import styles from "./AnnotationNumber.module.css";

interface AnnotationNumberProps {
  number: number;
}

const AnnotationNumber: React.FC<AnnotationNumberProps> = ({ number }) => {
  const fontSize = number >= 100 ? "9px" : number >= 10 ? "11px" : "13px";

  return (
    <span className={styles.annotationNumber} style={{ fontSize }}>
      {number}
    </span>
  );
};

export default AnnotationNumber;
