import React, { useEffect,useMemo, useState } from "react";
import styles from "./TransactionPreview.module.css";
import Button3 from "../../../Buttons/Button3";
import Icon from "../../../Icons/Icon";
import { useTranslation } from "react-i18next";
interface Props {
  ownedShares: number;
  buyPower: number;
  selectedStock: {
    symbol_id: number;
    ticker: string;
    asset_type: "stock" | "crypto" | "etf";
  } | null;
}


const TransactionPreview: React.FC<Props> = ({
  ownedShares,
  buyPower,
  selectedStock,
}) => {
  const { t } = useTranslation();

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [limitPrice, setLimitPrice] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<"shares" | "amount">("shares");
  const [inputValue, setInputValue] = useState<string>("");
  const [placeholderText, setPlaceholderText] = useState("0");
  const [loading, setLoading] = useState(true);

  const numericInputValue = parseFloat(inputValue) || 0;

  /* ---------- Price fetch ---------- */
  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedStock) return;
      try {
        setLoading(true);
        const res = await fetch("/api/price_snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol_id: selectedStock.symbol_id,
            symbol: selectedStock.ticker,
            asset_type: selectedStock.asset_type,
          }),
        });
        const data = await res.json();
        const newPrice =
          data?.current_price && data.current_price !== 0
            ? data.current_price
            : data?.last_close ?? null;
        setCurrentPrice(newPrice);
      } catch (err) {
        console.error("Error fetching price:", err);
        setCurrentPrice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPrice();
  }, [selectedStock]);

  /* ---------- Sync limit price with fetched price ---------- */
  useEffect(() => {
    if (currentPrice !== null) setLimitPrice(currentPrice);
  }, [currentPrice]);

  /* ---------- Helpers ---------- */
  const estValue = useMemo(
    () =>
      inputMode === "shares"
        ? numericInputValue * (limitPrice ?? 0)
        : numericInputValue,
    [inputMode, numericInputValue, limitPrice]
  );

  const estShares = useMemo(
    () =>
      inputMode === "amount" && limitPrice
        ? numericInputValue / limitPrice
        : numericInputValue,
    [inputMode, numericInputValue, limitPrice]
  );

  const maxShares = limitPrice ? Math.floor(buyPower / limitPrice) : 0;
  const maxAmount = buyPower;
  const maxSellShares = ownedShares;

  const handlePriceChange = (delta: number) => {
    if (limitPrice == null) return;
    const newPrice = Math.max(0.01, limitPrice + delta);
    setLimitPrice(parseFloat(newPrice.toFixed(2)));
  };

  const handlePlaceOrder = async () => {
    if (!selectedStock || !limitPrice || numericInputValue <= 0) return;
    // API call omitted for brevity
  };

  /* ---------- JSX ---------- */
  return (
    <div className={styles.container}>
      {/* BUYING POWER */}
      <div className={styles.buyingPower}>
        {t("transaction_preview.buying_power")}: ${buyPower.toFixed(2)}
      </div>

      {/* MODE SELECTOR */}
      <div className={styles.modeSelector}>
        <select
          id="modeSelect"
          value={inputMode}
          onChange={(e) =>
            setInputMode(e.target.value as "shares" | "amount")
          }
        >
          <option value="shares">
            {t("transaction_preview.mode.shares")}
          </option>
          <option value="amount">
            {t("transaction_preview.mode.amount")}
          </option>
        </select>
      </div>

      {/* QUANTITY / AMOUNT INPUT */}
      <div className={styles.inputWrapper}>
        <input
          type="number"
          className={styles.quantityInput}
          min={0}
          max={
            inputMode === "shares"
              ? Math.min(maxShares, maxSellShares)
              : maxAmount
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholderText}
          onFocus={() => setPlaceholderText("")}
          onBlur={() => !inputValue && setPlaceholderText("0")}
        />
      </div>

      {/* ESTIMATES */}
      <span className={styles.estimate}>
        {inputMode === "shares"
          ? t("transaction_preview.est_value", {
              value: estValue.toFixed(2),
            })
          : t("transaction_preview.est_shares", {
              shares: estShares.toFixed(4),
            })}
      </span>

      {/* LIMIT PRICE BOX */}
      <div className={styles.secondBox}>
        <span className={styles.limitPrice}>
          {t("transaction_preview.limit_price")}
        </span>

        <div className={styles.priceControls}>
          <button
            className={styles.priceButton}
            onClick={() => handlePriceChange(-0.1)}
          >
            <Icon name="minus" />
          </button>

          <span className={styles.priceDisplay}>
            ${limitPrice?.toFixed(2) ?? "0.00"}
          </span>

          <button
            className={styles.priceButton}
            onClick={() => handlePriceChange(0.1)}
          >
            <Icon name="plus" />
          </button>
        </div>

        <span className={styles.subText}>
          {t("transaction_preview.set_price_hint")}
        </span>
      </div>

      {/* PLACE ORDER BUTTON */}
      <Button3
        text={t("transaction_preview.place_order")}
        disabled={
          !selectedStock ||
          !limitPrice ||
          numericInputValue <= 0 ||
          (inputMode === "shares" &&
            (numericInputValue > maxShares ||
              numericInputValue > ownedShares)) ||
          (inputMode === "amount" && numericInputValue > maxAmount)
        }
        onClick={handlePlaceOrder}
      />
    </div>
  );
};

export default TransactionPreview;

// const TransactionPreview: React.FC<Props> = ({ ownedShares, buyPower, selectedStock }) => {

//   const [currentPrice, setCurrentPrice] = useState<number | null>(null);
//   const [limitPrice, setLimitPrice] = useState<number | null>(null);
//   const [inputMode, setInputMode] = useState<"shares" | "amount">("shares");
//   const [inputValue, setInputValue] = useState<string>("");
//   const [placeholderText, setPlaceholderText] = useState("0");
//   const [loading, setLoading] = useState(true);

//   const quantity = Number(inputValue);

// const handlePlaceOrder = async () => {
//   if (!selectedStock || !limitPrice || quantity <= 0) return;

//   try {
//     const res = await fetch("/api/place_order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         symbol_id: selectedStock.symbol_id,
//         price: limitPrice,
//         quantity,
//         operation: inputMode === "shares" ? "buy" : "sell",
//         user_id: "abc", // default user
//       }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || "Unknown error");

//     console.log("✅ Order placed successfully:", data);
//     // Optional: reset form or show confirmation
//   } catch (err) {
//     console.error("❌ Failed to place order:", err);
//   }
// };

//   // Fetch current price from API
//   useEffect(() => {
//     const fetchPrice = async () => {
//       if (!selectedStock) return;
//       try {
//         setLoading(true);
//         const res = await fetch("/api/price_snapshot", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             symbol_id: selectedStock.symbol_id,
//             symbol: selectedStock.ticker,
//             asset_type: selectedStock.asset_type,
//           }),
//         });
//         const data = await res.json();
//         console.log("USE EFFECT CALLED AND DATA IS: ", data)

//         if (data?.current_price && data.current_price !== 0) {
//           setCurrentPrice(data.current_price);
//           // setLimitPrice(data.current_price);
//         } else if (data?.last_close) {
//           setCurrentPrice(data.last_close);
//         } else {
//           setCurrentPrice(null);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching price:", err);
//         setCurrentPrice(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrice();
//   }, [selectedStock]);

//   useEffect(() => {
//     console.log("use effect to change limit price called, and current price is: ", currentPrice)
//     if (currentPrice !== null) {
//       setLimitPrice(currentPrice);
//     }
//   }, [currentPrice]);

//   const numericInputValue = parseFloat(inputValue) || 0;

//   const estValue =
//     inputMode === "shares" ? numericInputValue * (limitPrice ?? 0) : numericInputValue;
//   const estShares =
//     inputMode === "amount" && limitPrice ? numericInputValue / limitPrice : numericInputValue;

//   const maxShares = limitPrice ? Math.floor(buyPower / limitPrice) : 0;
//   const maxAmount = buyPower;
//   const maxSellShares = ownedShares;

//   const handlePriceChange = (delta: number) => {
//     if (limitPrice === null) return;
//     const newPrice = Math.max(0.01, limitPrice + delta);
//     setLimitPrice(parseFloat(newPrice.toFixed(2)));
//   };

//   return (
//     <div className={styles.container}>
//       {/* QUANTITY BOX */}
//       <div className={styles.quantityBox}>
//         <div className={styles.buyingPower}>
//           Buying Power: ${buyPower.toFixed(2)}
//         </div>

//         <div className={styles.modeSelector}>
//           <select
//             id="modeSelect"
//             value={inputMode}
//             onChange={(e) => setInputMode(e.target.value as "shares" | "amount")}
//           >
//             <option value="shares">Number of Shares</option>
//             <option value="amount">Amount ($)</option>
//           </select>
//         </div>

//         <div className={styles.inputWrapper}>
    
//         <input
//   type="number"
//   className={styles.quantityInput}
//   min={0}
//   max={
//     inputMode === "shares"
//       ? Math.min(maxShares, maxSellShares)
//       : maxAmount
//   }
//   value={inputValue}
//   onChange={(e) => setInputValue(e.target.value)}
//   placeholder={placeholderText}
//   onFocus={() => setPlaceholderText("")}
//   onBlur={() => {
//     if (inputValue === "") setPlaceholderText("0");
//   }}
// />

//         </div>

//         <span className={styles.estimate}>
//           {inputMode === "shares"
//             ? `Est. Value: $${estValue.toFixed(2)}`
//             : `Est. Shares: ${estShares.toFixed(4)}`}
//         </span>
//       </div>

//       {/* LIMIT PRICE BOX */}
//       <div className={styles.secondBox}>
//         <span className={styles.limitPrice}>Limit Price</span>
//         <div className={styles.priceControls}>
//           <button
//             className={styles.priceButton}
//             onClick={() => handlePriceChange(-0.1)}
//           >
//             <Icon name="minus" />
//           </button>

//           <span className={styles.priceDisplay}>
//             ${limitPrice?.toFixed(2) ?? "0.00"}
//           </span>

//           <button
//             className={styles.priceButton}
//             onClick={() => handlePriceChange(0.1)}
//           >
//             <Icon name="plus" />
//           </button>
//         </div>
//         <span className={styles.subText}>Set an order price per share</span>
//       </div>

//       {/* PLACE ORDER */}
//       <div>
//  <Button3
//           text={"Place Order"}
//           disabled={
//             !selectedStock ||
//             !limitPrice ||
//             numericInputValue <= 0 ||
//             (inputMode === "shares" &&
//               (numericInputValue > maxShares || numericInputValue > ownedShares)) ||
//             (inputMode === "amount" && numericInputValue > maxAmount)
            
//             }
//             onClick={handlePlaceOrder}
//         /> 
//       </div>
//     </div>
//   );
// };

// export default TransactionPreview;


// type Props = {
//   ownedShares: number;
//   buyPower:number;
//   selectedStock: any;
  
//   // onPlaceOrder: (quantity: number, limitPrice: number) => void;
// };

// const TransactionPreview: React.FC<Props> = ({ownedShares, buyPower,selectedStock }) => {
  
//   const [currentPrice, setCurrentPrice] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("USE EFFECT IS TRIGGERING")
//     const fetchPrice = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/price_snapshot", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             symbol_id: selectedStock.symbol_id,
//             symbol: selectedStock.ticker,
//             asset_type: selectedStock.asset_type,
//           }),
//         });

//         const data = await res.json();
//         console.log("🔄 Price data from snapshot:", data);

//         if (data?.current_price) {
//           setCurrentPrice(data.current_price);
//         } else {
//           setCurrentPrice(null);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching price:", err);
//         setCurrentPrice(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedStock) {
//       fetchPrice();
//     }
//   }, [selectedStock]);

//   console.log("current price is: ", currentPrice)

//   const [limitPrice, setLimitPrice] = useState<number | null>(null);

// // Set limitPrice after currentPrice is available
// useEffect(() => {
//   if (currentPrice !== null) {
//     setLimitPrice(currentPrice);
//   }
// }, [currentPrice]);

//   const [inputMode, setInputMode] = useState<"shares" | "amount">("shares");
//   const [inputValue, setInputValue] = useState<number>(0);
//   const buyingPower = 0; // you can pass this as a prop or calculate it

//   //const [quantity, setQuantity] = useState(1);
//   const quantity = inputMode === "shares" ? inputValue : inputValue / currentPrice;

  
//   const handlePriceChange = (delta: number) => {
//     const newPrice = Math.max(0.01, limitPrice + delta);
//     setLimitPrice(parseFloat(newPrice.toFixed(2)));
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.quantityBox}>
//   {/* Row 1: Buying power */}
//   <div className={styles.buyingPower}>
//     Buying Power: ${buyingPower.toFixed(2)}
//   </div>

//   {/* Row 2: Mode selector */}
//   <div className={styles.modeSelector}>
   
//     <select
    
//       id="modeSelect"
//       value={inputMode}
//       onChange={(e) => setInputMode(e.target.value)}
//     >
//       <option value="shares">Number of Shares</option>
//       <option value="amount">Amount ($)</option>
//     </select>
//   </div>

//   {/* Row 3: Input field */}
//   <div className={styles.inputWrapper}>
//     {/* <label>{inputMode === "shares" ? "Shares" : "Amount ($)"}</label> */}
//     <input
//       type="number"
//       className={styles.quantityInput}
//       min={0}
//       value={inputValue}
//       onChange={(e) => setInputValue(Number(e.target.value))}
//     />
//   </div>

//   {/* Row 4: Summary */}
//   <span className={styles.estimate}>
//     {inputMode === "shares"
//       ? `Est. Value: $${(inputValue * currentPrice).toFixed(2)}`
//       : `Est. Shares: ${(inputValue / currentPrice).toFixed(4)}`}
//   </span>
// </div>

// <div className={styles.secondBox}>

// <span className={styles.limitPrice}>LimitPrice</span>
//       <div className={styles.priceControls}>
//         <button className={styles.priceButton} onClick={() => handlePriceChange(-0.1)}>
//             <Icon name="minus"/>
//         </button>
       
//         <span className={styles.priceDisplay}>
//   ${limitPrice?.toFixed(2) ?? "0.00"}
// </span>
//         <button className={styles.priceButton} onClick={() => handlePriceChange(0.1)}>
//         <Icon name="plus"/>
//         </button>
       
//       </div>

//     <span className={styles.subText}>Set a order price per share</span>
//       </div>
//       <div>

//         <Button3
//         text={"Place Order"}
//         />
  
//       </div>
//     </div>
//   );
// };

// export default TransactionPreview;




