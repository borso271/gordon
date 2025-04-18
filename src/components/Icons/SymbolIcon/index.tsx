
import styles from "./SymbolIcon.module.css";
import React, { useState } from "react";




type SymbolIconProps = {
  asset_type: "stock" | "crypto" | "etf";
  ticker_symbol: string;
  size?: number;
};

const SymbolIcon: React.FC<SymbolIconProps> = ({
  asset_type,
  ticker_symbol,
  size = 40,
}) => {
  /* 🟢 Build the URL every render so it always matches the current prop */
  const formatted =
    asset_type === "crypto"
      ? `_c_${ticker_symbol.toUpperCase()}`
      : ticker_symbol.toUpperCase();

  const imgSrc = `/symbol_icons/${formatted}.svg`;

  /* 🚑 Fallback to default_icon.svg on load error */
  const handleError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.onerror = null;            // prevent infinite loop
    e.currentTarget.src = "/default_icon.svg"; // fallback icon
  };

  return (
    <div
      className={styles.iconContainer}
      style={{
        width: size,
        height: size,
        border: "1px solid #232323",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <img
        src={imgSrc}
        alt={`${ticker_symbol} logo`}
        className={styles.icon}
        onError={handleError}
        width={size * 0.8}
        height={size * 0.8}
      />
    </div>
  );
};

export default SymbolIcon;

// const SymbolIcon: React.FC<SymbolIconProps> = ({
//   asset_type,
//   ticker_symbol,
//   size = 40,
// }) => {


//   const [imgSrc, setImgSrc] = useState<string>(() => {


    
//     const formatted =
//       asset_type === "crypto"
//         ? `_c_${ticker_symbol.toUpperCase()}`
//         : ticker_symbol.toUpperCase();
//     return `/symbol_icons/${formatted}.svg`;
//   });

//   const handleError = () => {
//     setImgSrc("/default_icon.svg");
//   };



//   return (
   
// <div
//   className={styles.iconContainer}
//   style={{
//     width: size,
//     height: size,
//     border: '1px solid #232323', // or use a stroke-like color
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#000' // or transparent
//   }}
// >
//   <img
//     src={imgSrc}
//     alt={`${ticker_symbol} logo`}
//     className={styles.icon}
//     onError={handleError}
//     width={size * 0.8}
//     height={size * 0.8}
//   />
// </div>
//   );
// };

// export default SymbolIcon;

