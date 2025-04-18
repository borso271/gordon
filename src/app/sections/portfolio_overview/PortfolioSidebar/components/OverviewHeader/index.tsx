import React from 'react';
import styles from './OverviewHeader.module.css';
import PrimaryDivider from '../../../../../../components/Layout/PrimaryDivider';
import ValueChangeDisplay from '../../../../../../components/Layout/ChatNavbar/ValueChangeDisplay';
import { useTranslation } from 'react-i18next';




// const dataForHeader = {
//   number_of_transactions: data.number_of_transactions,
//   realized_gains: data.realized_gains,
//   user_balance: data.user_balance,
//   start_date: data.start_date,
//   unrealizedGainLoss: data.unrealizedGainLoss,
//   totalInvested: data.totalInvested,
// };

const OverviewHeader = ({
  dataForHeader
}) => {



  console.log("dataForHeader is: ", dataForHeader)
// Starting balance = totalInvested - unrealized gains + realized gains

// Current market value = total value of assets + cash
const current_market_value = dataForHeader.user_balance - dataForHeader.user_cash;
const start_market_value = current_market_value - dataForHeader.realized_gains - dataForHeader.unrealizedGainLoss;
const net_profit_loss = dataForHeader.realized_gains + dataForHeader.unrealizedGainLoss;
  const currency="$";
  const format = (v: number) => `${currency}${v.toFixed(2)}`;
  const { t } = useTranslation();
  const total_transactions =dataForHeader.number_of_transactions;
  const realizedChange = dataForHeader.realized_gains;
  const unrealizedChange =dataForHeader.unrealizedGainLoss;
 



  const realizedPercentChange = start_market_value > 0
  ? (realizedChange / start_market_value) * 100
  : 0;

const unrealizedPercentChange = start_market_value > 0
  ? (unrealizedChange / start_market_value) * 100
  : 0;

const netPercentChange = start_market_value > 0
  ? (net_profit_loss / start_market_value) * 100
  : 0;



  //const netPercentChange = (net_profit_loss / start_market_value) * 100;

  
  return (

    <div className={styles.wrapper}>
    <div className={styles.row}>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('total_transactions')}</div>
        <div className={styles.value}>{total_transactions}</div>
      </div>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('start_market_value')}</div>
        <div className={styles.value}>{format(start_market_value)}</div>
      </div>
    </div>
    <PrimaryDivider marginTop={14} marginBottom={14} />

    <div className={styles.row}>
      <div className={styles.metricWrapper}>
        <div className={styles.label}>{t('end_market_value')}</div>
        <div className={styles.value}>{format(current_market_value)}</div>
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
          <ValueChangeDisplay change={net_profit_loss} percentChange={netPercentChange} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default OverviewHeader;
