// context/BuySellModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { SimpleTicker } from "../../interfaces";
type BuySellModalContextType = {
  showModal: (initialStock?: any) => void;
  hideModal: () => void;
  isVisible: boolean;
  tickerToBuy: SimpleTicker | null;
  setTickerToBuy: React.Dispatch<React.SetStateAction<SimpleTicker | null>>

};

const BuySellModalContext = createContext<BuySellModalContextType | undefined>(undefined);

export const BuySellModalProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tickerToBuy, setTickerToBuy] = useState<any | null>(null);

  const showModal = (stock?: any) => {
    setTickerToBuy(stock ?? null);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setTickerToBuy(null);
  };

  return (
    <BuySellModalContext.Provider value={{ showModal, hideModal, isVisible, tickerToBuy,setTickerToBuy }}>
      {children}
    </BuySellModalContext.Provider>
  );
};

export const useBuySellModal = () => {
  const context = useContext(BuySellModalContext);
  if (!context) throw new Error("useBuySellModal must be used within BuySellModalProvider");
  return context;
};
