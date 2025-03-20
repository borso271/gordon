import React, { useState } from "react";
import styles from "./ExpandableDropdown.module.css";
import Icon from "../../Icons/Icon";
import Markdown from "react-markdown";


const ExpandableDropdown = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.expandableDropdown}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.dropdownItem} ${expandedIndex === index ? styles.expanded : ""}`}
        >
          {/* ✅ Ensure clicking anywhere inside `.header` toggles the dropdown */}
          <div className={styles.header} onClick={() => handleToggle(index)}>
            <span className={styles.label}>{item.label}</span>
            {/* ✅ Remove onClick from the icon itself */}
            <Icon
    name={expandedIndex === index ? "chevron_up" : "chevron_down"}
    size={18}
    className={styles.icon}
    style={{ pointerEvents: "none" }} // ✅ Key fix
  />
          </div>

          {/* ✅ Expanded Content */}
          {expandedIndex === index && (
            <div className={styles.content}>
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpandableDropdown;

// const ExpandableDropdown = ({ items }) => {
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // ✅ Track only one open item

//   const handleToggle = (index: number) => {
//     setExpandedIndex((prevIndex) => (prevIndex === index ? null : index)); // ✅ Close if clicked again
//   };

//   return (
//     <div className={styles.expandableDropdown}>
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className={`${styles.dropdownItem} ${expandedIndex === index ? styles.expanded : ""}`}
//         >
//           {/* Header Section (Text + Expand Icon) */}
//           <div className={styles.header} onClick={() => handleToggle(index)}>
//             <span className={styles.label}>{item.label}</span>
//             <Icon
//   name={expandedIndex === index ? "chevron_up" : "chevron_down"}
//   size={18}
//   className={styles.icon}
//   onClick={(e) => e.stopPropagation()} // ✅ Prevents click bubbling
// />

//           </div>

//           {/* Expanded Content */}
//           {expandedIndex === index && (
//             <div className={styles.content}>
              
//               <Markdown>{item.content}</Markdown>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ExpandableDropdown;



// const ExpandableDropdown = ({ items }) => {
//   const [expandedIndexes, setExpandedIndexes] = useState([]); // Track multiple expanded items

//   const handleToggle = (index) => {
//     setExpandedIndexes((prevIndexes) =>
//       prevIndexes.includes(index)
//         ? prevIndexes.filter((i) => i !== index) // Remove if already expanded
//         : [...prevIndexes, index] // Add if not expanded
//     );
//   };

//   return (
//     <div className={styles.expandableDropdown}>
//       {items.map((item, index) => (
//         <div key={index}  className={${styles.dropdownItem} ${expandedIndexes.includes(index) ? styles.expanded : ""}}>
//           {/* Header Section (Text + Expand Icon) */}
          
//           <div className={styles.header} onClick={() => handleToggle(index)}>
//             <span className={styles.label}>{item.label}</span>
//             <Icon
//               name={expandedIndexes.includes(index) ? "chevron_up" : "chevron_down"}
//               size={18}
//               className={styles.icon}
//             />
//           </div>

//           {/* Expanded Content */}
//           <div className={${styles.content} ${expandedIndexes.includes(index) ? styles.expanded : ""}}>
//             <Markdown>{item.content}</Markdown>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ExpandableDropdown;