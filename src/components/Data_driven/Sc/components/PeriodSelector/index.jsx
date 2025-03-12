import styles from "./PeriodSelector.module.css";

const PeriodSelector = ({ selectedPeriod, setSelectedPeriod }) => {
    const periods = ["1D", "1W", "1M", "1Y", "5Y"];

    return (
        <div className={styles.container}>
            {periods.map((period) => (
                <button
                    key={period}
                    className={`${styles.button} ${selectedPeriod === period ? styles.active : ""}`}
                    onClick={() => setSelectedPeriod(period)}
                >
                    {period}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;
