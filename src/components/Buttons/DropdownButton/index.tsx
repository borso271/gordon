import React from "react";
import styles from "./DropdownButton.module.css";
import Icon from "../../Icons/Icon";
import CircledIcon from "../../Icons/CircledIcon";


interface DropdownButtonProps {
  text?: string;           // selected label
  placeholder?: string;    // fallback label when text is undefined
  leftIcon?: string | null;
  rightIcon?: string | null;
  rightIconSize?: number;
  onClick?: () => void;
  className?: string;
  width?: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  text,
  placeholder = "Select…",
  leftIcon,
  rightIcon,
  rightIconSize = 20,
  onClick,
  className,
  width,
}) => (
  <button
    className={`${styles.dropdownButton} ${className ?? ""}`.trim()}
    onClick={onClick}
    style={width ? { width } : undefined}
  >
    {leftIcon && (
      <span className={styles.icon}>
        <CircledIcon name={leftIcon} size={18} />
      </span>
    )}

    {/* Use text if provided, otherwise placeholder */}
    <span className={styles.text}>{text ?? placeholder}</span>

    {rightIcon && (
      <span className={styles.icon}>
        <Icon name={rightIcon} size={rightIconSize} />
      </span>
    )}
  </button>
);

export default DropdownButton;

// interface DropdownButtonProps {
//   text?: string;
//   leftIcon?: string | null;
//   rightIcon?: string | null;
//   rightIconSize?: number;
//   onClick?: () => void;
//   className?: string;
//   width?: number;
// }

// const DropdownButton: React.FC<DropdownButtonProps> = ({
//   text,
//   leftIcon,
//   rightIcon,
//   rightIconSize,
//   onClick,
//   className,
//   width,
// }) => {
//   return (
//     <button
//       className={`${styles.dropdownButton} ${className ? styles[className] : ""}`.trim()}
//       onClick={onClick}
//       style={width ? { width: `${width}px` } : {}}
//     >
//       {/* Left Icon (Optional) */}
//       {leftIcon && (
//         <span className={styles.icon}>
//           <CircledIcon name={leftIcon} size={18} />
//         </span>
//       )}

//       {/* Button Text (Optional) */}
//       {text && <span className={styles.text}>{text}</span>}

//       {/* Right Icon (Optional) */}
//       {rightIcon && (
//         <span className={styles.icon}>
//           <Icon name={rightIcon} size={rightIconSize || 20} />
//         </span>
//       )}
//     </button>
//   );
// };

// export default DropdownButton;
