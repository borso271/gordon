// import React from "react";

// const PrimaryDivider: React.FC = () => {
//   return (
//     <svg width="100%" height="1" xmlns="http://www.w3.org/2000/svg">
//       <line
//         x1="0"
//         y1="0"
//         x2="100%"
//         y2="0"
//         stroke="rgba(255, 255, 255, 0.08)"
//         strokeWidth="1"
//       />
//     </svg>
//   );
// };

// export default PrimaryDivider;


import React from 'react';
import styles from './PrimaryDivider.module.css';

interface DividerProps {
  height?: number;
  marginTop?: number;
  marginBottom?: number;
}

const PrimaryDivider: React.FC<DividerProps> = ({
  height = 1,
  marginTop = 0,
  marginBottom = 0,
}) => {
  return (
    <div
      className={styles.divider}
      style={{
        height,
        marginTop,
        marginBottom,
      }}
    />
  );
};

export default PrimaryDivider;
