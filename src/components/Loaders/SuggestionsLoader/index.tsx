import React from "react";
import styles from "./SuggestionsLoader.module.css";
import SnapshotLoader from "../SnapshotLoader";
const SuggestionsLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Upper Section */}
      <div className={styles.upperSection}>
      <div className={styles.upperLeft}></div>
      <div className={styles.upperRight}></div>
      </div>
      {/* Lower Section */}
      <div className={styles.lowerSection}>
      <SnapshotLoader/>
      <SnapshotLoader/>
      <SnapshotLoader/>
      <SnapshotLoader/>
      <SnapshotLoader/>
      <SnapshotLoader/>
      </div>
    </div>
  );
};

export default SuggestionsLoader;
