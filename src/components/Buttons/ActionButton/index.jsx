// import React from "react";
// import styles from "./ActionButton.module.css";
// import Icon from "../../Icons/Icon";

// const ActionButton = ({ iconName, text, onClick, disabled }) => {
//     console.log("ONCLICK IS: ", onClick)
//   return (
//     <button onClick={!disabled ? onClick : undefined}
//     className={styles.actionButton}>
//       <Icon name={iconName} className={styles.icon} />
//       <span className={styles.text}>{text}</span>
//     </button>
//   );
// };

// export default ActionButton;

import React, { useState } from "react";
import styles from "./ActionButton.module.css";
import Icon from "../../Icons/Icon";

const ActionButton = ({ iconName, successIcon = "check", text, onClick, disabled }) => {
  const [currentIcon, setCurrentIcon] = useState(iconName); // Track icon state

  const handleClick = async () => {
    if (disabled) return;

    try {
      await onClick(); // Wait for the function to complete
      setCurrentIcon(successIcon); // Change to success icon

      // Optionally reset back to original after 1.5s
      setTimeout(() => {
        setCurrentIcon(iconName);
      }, 1500);
    } catch (error) {
      console.error("Error in ActionButton:", error);
    }
  };

  return (
    <button onClick={handleClick} className={styles.actionButton}>
      <Icon name={currentIcon} className={styles.icon} size={18} />
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default ActionButton;
