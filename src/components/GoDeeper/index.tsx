import React from "react";
import styles from "./GoDeeper.module.css";
import Icon from "../Icons/Icon";
import PrimaryDivider from "../Layout/PrimaryDivider";
import SectionHeader from "../Headings/SectionHeader";
import GoDeeperLoader from "../Loaders/GoDeeperLoader";

interface GoDeeperProps {
  items: string[];
  newSearch: (prompt: string) => void;
}

const GoDeeper: React.FC<GoDeeperProps> = ({ items, newSearch }) => {
  if (!items || items.length === 0) {
    return <GoDeeperLoader />;
  }

  return (
    <div className={styles.container}>
      <SectionHeader icon="go_deeper_icon" title="Go Deeper" size={18} />

      <div className={styles.itemsContainer}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className={styles.goItem} onClick={() => newSearch(item)}>
              <span className={styles.text}>{item}</span>
              <Icon name="circled_plus" size={18} className={styles.icon} />
            </div>

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

export default GoDeeper;


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

