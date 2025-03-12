
import React from "react";
import styles from "./DropdownMenu.module.css";
import CircledIcon from "../../Icons/CircledIcon";


const DropdownMenu = ({ items, selectedIndex, setSelectedIndex, isOpen }) => {
    return (
      <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${selectedIndex === index ? styles.active : ""}`}
            onClick={() => {
              setSelectedIndex(index); // Update the selected item
              item.onClick(); // Execute the item's action
            }}
          >
            <CircledIcon name={item.icon} size={18} color="" className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  };
  
  export default DropdownMenu;
  
// const DropdownMenu = ({ items, isOpen }) => {
//   return (
//     <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}>
//       {items.map((item, index) => (
//         <div key={index} className={styles.menuItem} onClick={item.onClick}>
//           <CircledIcon name={item.icon} size={18} color="" className={styles.icon} />
//           <span className={styles.label}>{item.label}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DropdownMenu;


