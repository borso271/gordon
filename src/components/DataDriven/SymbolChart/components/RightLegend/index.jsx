import { useEffect, useState } from "react";
import styles from "./RightLegend.module.css";

const RightLegend = ({ dayMin, dayMax, currentPrice, n = 5 }) => {
    const [fixedPrices, setFixedPrices] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);

    useEffect(() => {
        const topPrice = dayMax * 1.1;
        const bottomPrice = dayMin * 0.9;
        const priceStep = (topPrice - bottomPrice) / (n - 1);

        const computedPrices = Array.from({ length: n }, (_, i) => (topPrice - i * priceStep).toFixed(2));

        setFixedPrices(computedPrices);
    }, [dayMin, dayMax, n]);

    useEffect(() => {
        const topPrice = dayMax * 1.1;
        const bottomPrice = dayMin * 0.9;

        const position = ((topPrice - currentPrice) / (topPrice - bottomPrice)) * 80 + 10; // Adjusted range
        setCurrentPosition(position);
    }, [currentPrice, dayMin, dayMax]);

    return (
        <div className={styles.legendContainer}>
            {fixedPrices.map((price, index) => {
                const position = (index / (n - 1)) * 80 + 10; // Adjusted range to avoid overflow
                return (
                    <div key={index} className={styles.fixedPrice} style={{ top: `${position}%` }}>
                        {price}
                    </div>
                );
            })}


<div className={styles.currentPrice} style={{ top: `${currentPosition}%` }}>
    {currentPrice !== undefined && currentPrice !== null ? currentPrice.toFixed(2) : "--"}
</div>
{/* 
            <div className={styles.currentPrice} style={{ top: `${currentPosition}%` }}>
                {currentPrice.toFixed(2)}
            </div> */}
        </div>
    );
};

export default RightLegend;
