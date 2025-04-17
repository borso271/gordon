// TradeButton.tsx

import React from 'react';
import styles from './TradeButton.module.css'; // Import its own styles
import { SimpleTicker } from '../../../interfaces';
import { useBuySellModal } from '../../../app/context/buySellModalContext';
import { useTranslation } from "react-i18next";


interface TradeButtonProps {
  ticker: SimpleTicker;
  isHovered?: boolean;
  width?: string | number; // e.g., '100px' or 120
}

const TradeButton: React.FC<TradeButtonProps> = ({
  ticker,
  isHovered = false,
  width,
}) => {

  const { t } = useTranslation();
  const { showModal,setTickerToBuy } = useBuySellModal();
  const handleTradeClick = () => {
    showModal()
    setTickerToBuy(ticker)
  };

  const buttonClasses = `
    ${styles.tradeButton}
    ${isHovered ? styles.hovered : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleTradeClick}
      style={width ? { width } : undefined}>
      {t("trade")}
    </button>
  );
};

export default TradeButton;
