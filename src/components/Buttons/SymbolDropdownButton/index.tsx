import React from "react";
import styles from "./SymbolDropdownButton.module.css";
import SymbolIcon from "../../Icons/SymbolIcon";

interface SymbolDropdownButtonProps {
  text?: string;           // Selected label
  placeholder?: string;    // Fallback label when text is undefined
  ticker_symbol: string;   // Symbol to determine icon name
  asset_type: "stock" | "crypto" | "etf"; // Needed for icon formatting
  onClick?: () => void;
  className?: string;
  width?: number;
}


const SymbolDropdownButton: React.FC<SymbolDropdownButtonProps> = ({
  text,
  placeholder = "Select…",
  ticker_symbol,
  asset_type,
  onClick,
  className,
  width,
}) => {
  const formattedIcon =
    asset_type === "crypto"
      ? `_c_${ticker_symbol.toUpperCase()}`
      : ticker_symbol.toUpperCase();

  return (
    <button
      className={`${styles.dropdownButton} ${className ?? ""}`.trim()}
      onClick={onClick}
      style={width ? { width } : undefined}
    >

        <SymbolIcon asset_type={asset_type} ticker_symbol={ticker_symbol} size={28} />
      

      <span className={styles.text}>{text ?? placeholder}</span>

     
    </button>
  );
};

export default SymbolDropdownButton;


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
