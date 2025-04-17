
import { useTranslation } from 'react-i18next';
import styles from './PercentageOverviewBox.module.css';
import PrimaryDivider from '../Layout/PrimaryDivider';
import PercentageOverview from './PercentageOverview';

interface Item {
  labelKey: string;
  percentage: number;
}

interface PercentageOverviewBoxProps {
  titleKey: string; // e.g. "portfolio.breakdown"
  items: Item[];
  labelWidth?: number; // optional prop
}

const PercentageOverviewBox: React.FC<PercentageOverviewBoxProps> = ({
  titleKey,
  items,
  labelWidth // optional prop
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.box}>
      <div className={styles.title}>{t(titleKey)}</div>
      <PrimaryDivider marginTop={16} marginBottom={24} />
      <PercentageOverview labelWidth={labelWidth} items={items} />
    </div>
  );
};

export default PercentageOverviewBox;
