import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  percentage: number; // between 0 and 100
  backgroundColor?: string;
  fillColor?: string;
  align?: 'left' | 'center' | 'right'; // new prop
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
  fillColor = '#B1F625',
  align = 'left',
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  let justifyContent: string;
  switch (align) {
    case 'center':
      justifyContent = 'center';
      break;
    case 'right':
      justifyContent = 'flex-end';
      break;
    case 'left':
    default:
      justifyContent = 'flex-start';
      break;
  }

  return (
    <div className={styles.progressBar} style={{ backgroundColor, justifyContent }}>
      <div
        className={styles.progressFill}
        style={{
          width: `${clampedPercentage}%`,
          backgroundColor: fillColor,
        }}
      />
    </div>
  );
};

export default ProgressBar;
