
import { useTranslation } from "react-i18next";
import styles from "./Ratings.module.css";
import { useAnalystRatings } from "../../../app/hooks/useAnalystRatings";
import ProgressBar from "../../ProgressBar";
import AnalystRatingLoader from "../../Loaders/RatingsLoader";
import SidebarHeading from "../../Headings/SidebarHeading";
const AnalystRatings = ({ ratings }) => {
  const { t, i18n } = useTranslation();

  const {
   
    error,
    totalRatings,
    mostVotedRating,
    getPercentage,
  } = useAnalystRatings(ratings);

  const dynamicTitle = mostVotedRating ? (
    <>
      {getPercentage(mostVotedRating.count)}%
      <span className={styles.says}> {t("analyst_ratings.says")} </span>
      {t(`analyst_ratings.${mostVotedRating.label.toLowerCase().replace(" ", "_")}`)}
    </>
  ) : t("analyst_ratings.default_title");

  if (!ratings) {
    return <AnalystRatingLoader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SidebarHeading  text={dynamicTitle} />
        <p className={styles.subheading}>
          {t("analyst_ratings.subheading", { count: totalRatings })}
        </p>
      </div>

      {/* {loading && <p className={styles.loading}>{t("loading")}</p>} */}
      {error && <p className={styles.error}>❌ {t("error", { error })}</p>}

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {[
            { label: "Strong Buy", count: ratings.strong_buy_count },
            { label: "Buy", count: ratings.buy_count },
            { label: "Hold", count: ratings.hold_count },
            { label: "Sell", count: ratings.sell_count },
            { label: "Strong Sell", count: ratings.strong_sell_count },
          ].map(({ label, count }) => (
            <div key={label} className={styles.row}>
              <div className={styles.label}>
                {t(`analyst_ratings.${label.toLowerCase().replace(" ", "_")}`)}
              </div>
              <div className={styles.percentageBarContainer}>
                <ProgressBar percentage={getPercentage(count)} />
              </div>
              <div className={styles.percentage}>
                {getPercentage(count)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalystRatings;
