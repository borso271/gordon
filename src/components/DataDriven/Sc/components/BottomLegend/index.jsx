import styles from "./BottomLegend.module.css";

import computeDatePoints from "./utils/compute_date_points";

const BottomLegend = ({ selectedPeriod,exchange_mic,asset_type,data }) => {
    const timePoints = computeDatePoints(selectedPeriod, data, exchange_mic,asset_type,mobile=false); // Get labels for selected period
    const paddingPercentage = 5; // Adjust padding (as % of container width)

    return (
        <div className={styles.legendContainer}>
            {timePoints.map((time, index) => {
                const position = (index / (timePoints.length - 1)) * (100 - 2 * paddingPercentage) + paddingPercentage;
                return (
                    <div key={index} className={styles.timePoint} style={{ left: `${position}%` }}>
                        {time}
                    </div>
                );
            })}
        </div>
    );
};

export default BottomLegend;

