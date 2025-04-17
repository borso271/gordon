import React, { useEffect, useState } from "react";
import styles from "./TransactionPreview.module.css";
import Button3 from "../../../Buttons/Button3";
import Icon from "../../../Icons/Icon";

// import { useEffect, useState } from "react";
// import styles from "./TransactionPreview.module.css";
// import Icon from "@/components/Icon";
// import Button3 from "@/components/Button3";
// import { Stock } from "@/types";

// type Props = {
//   ownedShares: number;
//   buyPower: number;
//   selectedStock: any;
// };
// import React, { useEffect, useState } from "react";
// import styles from "./TransactionPreview.module.css";
// import Icon from "@/components/Icons/Icon";
// import Button3 from "@/components/Buttons/Button3";

interface Props {
  ownedShares: number;
  buyPower: number;
  selectedStock: {
    symbol_id: number;
    ticker: string;
    asset_type: string;
  } | null;
}

const TransactionPreview: React.FC<Props> = ({ ownedShares, buyPower, selectedStock }) => {

  console.log("IN TRANSACTION PREVIEW, SELECTED STOCK IS: ", selectedStock)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [limitPrice, setLimitPrice] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<"shares" | "amount">("shares");
  const [inputValue, setInputValue] = useState<string>("");
  const [placeholderText, setPlaceholderText] = useState("0");
  const [loading, setLoading] = useState(true);

  const quantity = Number(inputValue);

const handlePlaceOrder = async () => {
  if (!selectedStock || !limitPrice || quantity <= 0) return;

  try {
    const res = await fetch("/api/place_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol_id: selectedStock.symbol_id,
        price: limitPrice,
        quantity,
        operation: inputMode === "shares" ? "buy" : "sell",
        user_id: "abc", // default user
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");

    console.log("✅ Order placed successfully:", data);
    // Optional: reset form or show confirmation
  } catch (err) {
    console.error("❌ Failed to place order:", err);
  }
};

  // Fetch current price from API
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
        console.log("USE EFFECT CALLED AND DATA IS: ", data)

        if (data?.current_price && data.current_price !== 0) {
          setCurrentPrice(data.current_price);
          // setLimitPrice(data.current_price);
        } else if (data?.last_close) {
          setCurrentPrice(data.last_close);
        } else {
          setCurrentPrice(null);
        }
        

      } catch (err) {
        console.error("❌ Error fetching price:", err);
        setCurrentPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [selectedStock]);

  // Set limitPrice initially to current price
  console.log("current price is: ", currentPrice)
  useEffect(() => {
    console.log("use effect to change limit price called, and current price is: ", currentPrice)
    if (currentPrice !== null) {
      setLimitPrice(currentPrice);
    }
  }, [currentPrice]);

  const numericInputValue = parseFloat(inputValue) || 0;

  const estValue =
    inputMode === "shares" ? numericInputValue * (limitPrice ?? 0) : numericInputValue;
  const estShares =
    inputMode === "amount" && limitPrice ? numericInputValue / limitPrice : numericInputValue;

  const maxShares = limitPrice ? Math.floor(buyPower / limitPrice) : 0;
  const maxAmount = buyPower;
  const maxSellShares = ownedShares;

  const handlePriceChange = (delta: number) => {
    if (limitPrice === null) return;
    const newPrice = Math.max(0.01, limitPrice + delta);
    setLimitPrice(parseFloat(newPrice.toFixed(2)));
  };

  return (
    <div className={styles.container}>
      {/* QUANTITY BOX */}
      <div className={styles.quantityBox}>
        <div className={styles.buyingPower}>
          Buying Power: ${buyPower.toFixed(2)}
        </div>

        <div className={styles.modeSelector}>
          <select
            id="modeSelect"
            value={inputMode}
            onChange={(e) => setInputMode(e.target.value as "shares" | "amount")}
          >
            <option value="shares">Number of Shares</option>
            <option value="amount">Amount ($)</option>
          </select>
        </div>

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
  onBlur={() => {
    if (inputValue === "") setPlaceholderText("0");
  }}
/>

        </div>

        <span className={styles.estimate}>
          {inputMode === "shares"
            ? `Est. Value: $${estValue.toFixed(2)}`
            : `Est. Shares: ${estShares.toFixed(4)}`}
        </span>
      </div>

      {/* LIMIT PRICE BOX */}
      <div className={styles.secondBox}>
        <span className={styles.limitPrice}>Limit Price</span>
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
        <span className={styles.subText}>Set an order price per share</span>
      </div>

      {/* PLACE ORDER */}
      <div>
 <Button3
          text={"Place Order"}
          disabled={
            !selectedStock ||
            !limitPrice ||
            numericInputValue <= 0 ||
            (inputMode === "shares" &&
              (numericInputValue > maxShares || numericInputValue > ownedShares)) ||
            (inputMode === "amount" && numericInputValue > maxAmount)
            
            }
            onClick={handlePlaceOrder}
        /> 
      </div>
    </div>
  );
};

export default TransactionPreview;


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




