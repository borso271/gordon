// components/Common/CollapsibleSection.tsx
import React, { useState } from 'react';
import styles from './ToggleList.module.css';
import Icon from '../Icons/Icon';
import PrimaryDivider from '../Layout/PrimaryDivider';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    divider?: boolean; // ✅ Optional divider prop
  }
  
  const ToggleList: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    defaultExpanded = false,
    divider = true, // ✅ Defaults to true
  }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
  
    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.topPart} ${!divider ? styles.noDivider : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.iconWrapper}>
            <Icon name={expanded ? 'chevron_up' : 'chevron_down'} size={20} />
          </div>
        </div>
  
        {expanded && divider && (
          <PrimaryDivider marginTop={16} marginBottom={8} />
        )}
  
        <div className={`${styles.gridContainer} ${expanded ? styles.expanded : styles.collapsed}`}>
          <div className={styles.itemsWrapper}>{children}</div>
        </div>
      </div>
    );
  };
  
  export default ToggleList;

  
// interface CollapsibleSectionProps {
//   title: string;
//   children: React.ReactNode;
//   defaultExpanded?: boolean;
// }

// const ToggleList: React.FC<CollapsibleSectionProps> = ({
//   title,
//   children,
//   defaultExpanded = false,
// }) => {
//   const [expanded, setExpanded] = useState(defaultExpanded);

//   return (
    
//     <div className={styles.wrapper}>
//       <div className={styles.topPart} onClick={() => setExpanded(!expanded)}>
//         <h3 className={styles.title}>{title}</h3>
//         <div className={styles.iconWrapper}>
//           <Icon name={expanded ? 'chevron_up' : 'chevron_down'} size={20} />
//         </div>
//       </div>

//       {expanded && <PrimaryDivider marginTop={16} marginBottom={8} />}

//       <div className={`${styles.gridContainer} ${expanded ? styles.expanded : styles.collapsed}`}>
//         <div className={styles.itemsWrapper}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ToggleList;
