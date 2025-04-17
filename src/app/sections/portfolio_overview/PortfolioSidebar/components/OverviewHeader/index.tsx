import React from 'react';
import styles from './OverviewHeader.module.css';
import PrimaryDivider from '../../../../../../components/Layout/PrimaryDivider';
import ValueChangeDisplay from '../../../../../../components/Layout/ChatNavbar/ValueChangeDisplay';
import { useTranslation } from 'react-i18next';

interface OverviewHeaderProps {
  start_amount: number;
  end_amount: number;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  start_amount,
  end_amount,
}) => {
  const change = end_amount - start_amount;

const percentChange =
start_amount !== 0
  ? (change / start_amount) * 100
  : 0;
  const currency="$";
  const format = (v: number) => `${currency}${v.toFixed(2)}`;
  const { t } = useTranslation();
  const total_transactions = 12;
  const realizedChange = 10;
  const unrealizedChange = 5000;
  const unrealizedPercentChange = 12;
  const realizedPercentChange = 5;

  const netChange = end_amount - start_amount;
  const netPercentChange = netChange/start_amount;
  
  return (

    <div className={styles.wrapper}>
    <div className={styles.row}>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('total_transactions')}</div>
        <div className={styles.value}>{format(total_transactions)}</div>
      </div>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('start_market_value')}</div>
        <div className={styles.value}>{format(start_amount)}</div>
      </div>
    </div>
    <PrimaryDivider marginTop={14} marginBottom={14} />

    <div className={styles.row}>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('end_market_value')}</div>
        <div className={styles.value}>{format(end_amount)}</div>
      </div>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('realized_gain_loss')}</div>
        <div className={styles.value}>
          <ValueChangeDisplay change={realizedChange} percentChange={realizedPercentChange} />
        </div>
      </div>
    </div>
    <PrimaryDivider marginTop={14} marginBottom={14} />

    <div className={styles.row}>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('unrealized_gain_loss')}</div>
        <div className={styles.value}>
          <ValueChangeDisplay change={unrealizedChange} percentChange={unrealizedPercentChange} />
        </div>
      </div>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('net_profit_loss')}</div>
        <div className={styles.value}>
          <ValueChangeDisplay change={netChange} percentChange={netPercentChange} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default OverviewHeader;
