import React from "react";
import { useBuySellModal } from "../../app/context/buySellModalContext";
import styles from "./BuySellModal.module.css";
import BuySell from ".";

const BuySellModalPortal = () => {
  const { isVisible, hideModal, tickerToBuy } = useBuySellModal();

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={hideModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <BuySell
          tickerToBuy={tickerToBuy}
          onPlaceOrder={(order) => {
            console.log("Order placed:", order);
            hideModal();
          }}
        />
      </div>
    </div>
  );
};

export default BuySellModalPortal;
