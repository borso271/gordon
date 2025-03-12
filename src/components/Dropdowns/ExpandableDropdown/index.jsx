import React, { useState } from "react";
import styles from "./ExpandableDropdown.module.css";
import Icon from "../../Icons/Icon/index.tsx";
import Markdown from "react-markdown";
const ExpandableDropdown = ({ items }) => {
  const [expandedIndexes, setExpandedIndexes] = useState([]); // Track multiple expanded items

  const handleToggle = (index) => {
    setExpandedIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index) // Remove if already expanded
        : [...prevIndexes, index] // Add if not expanded
    );
  };

  return (
    <div className={styles.expandableDropdown}>
      {items.map((item, index) => (
        <div key={index}  className={`${styles.dropdownItem} ${expandedIndexes.includes(index) ? styles.expanded : ""}`}>
          {/* Header Section (Text + Expand Icon) */}
          
          <div className={styles.header} onClick={() => handleToggle(index)}>
            <span className={styles.label}>{item.label}</span>
            <Icon
              name={expandedIndexes.includes(index) ? "chevron_up" : "chevron_down"}
              size={18}
              className={styles.icon}
            />
          </div>

          {/* Expanded Content */}
          <div className={`${styles.content} ${expandedIndexes.includes(index) ? styles.expanded : ""}`}>
            <Markdown>{item.content}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandableDropdown;

