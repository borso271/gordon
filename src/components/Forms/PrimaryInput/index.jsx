import React from "react";
import styles from "./PrimaryInput.module.css";

const PrimaryInput = ({ placeholder, value, onChange, type = "text" }) => {
  return (
    <input
      className={styles.primaryInput}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default PrimaryInput;


