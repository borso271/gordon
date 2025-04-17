
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PercentageOverview.module.css';
import ProgressBar from '../../ProgressBar';


type PercentageOverviewProps = {
  items: { labelKey: string; percentage: number }[];
  labelWidth?: number; // optional prop
};

const PercentageOverview: React.FC<PercentageOverviewProps> = ({
  items,
  labelWidth = 75, // default value here
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className={styles.container}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.row}>
          <div className={styles.label} style={{ width: `${labelWidth}px` }}>
            {t(item.labelKey)}
          </div>
          <div className={styles.bar}>
            <ProgressBar percentage={item.percentage} />
          </div>
          <div className={styles.value}>
            {item.percentage.toFixed(1)}{currentLang === 'ar' ? '٪' : '%'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PercentageOverview;
