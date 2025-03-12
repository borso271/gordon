import React from "react";
import styles from "./GoDeeper.module.css";
import Icon from "../Icons/Icon";
import SecondaryH2 from "../Headings/SecondaryH2";
import PrimaryDivider from "../Layout/PrimaryDivider";

const GoDeeper = ({ items, onIconClick, newSearch}) => {
    return (
      <div className={styles.container}>
        <SecondaryH2>Go Deeper</SecondaryH2>
  
        <div className={styles.itemsContainer}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className={styles.goItem} onClick={() => newSearch(item)}>
                <span className={styles.text}>{item}</span> {/* Directly use item */}
                <Icon
                  name="circled_plus"
                  size={18}
                  className={styles.icon}
                  onClick={() => onIconClick(item)} // Pass string directly
                />
              </div>
  
              {/* Divider Between Items (Not After Last Item) */}
              {index < items.length - 1 && (
                <div className={styles.dividerWrapper}>
                  <PrimaryDivider />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  
// const GoDeeper = ({ items, onIconClick }) => {
//   return (
//     <div className={styles.container}>
//       <SecondaryH2>Go Deeper</SecondaryH2>

//       <div className={styles.itemsContainer}>
//         {items.map((item, index) => (
//           <React.Fragment key={index}>
//             <div className={styles.goItem}>
//               <span className={styles.text}>{item.text}</span>
//               <Icon
//                 name="circled_plus"
//                 size={18}
//                 className={styles.icon}
//                 onClick={() => onIconClick(item)}
//               />
//             </div>

//             {/* Divider Between Items (Not After Last Item) */}
//             {index < items.length - 1 && (
//               <div className={styles.dividerWrapper}>
//                 <PrimaryDivider />
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

export default GoDeeper;
