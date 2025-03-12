import React from "react";
import styles from "./ProviderCard.module.css";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import Link from "next/link";

import Icon from "../../../Icons/Icon/index.tsx";

import PrimaryDivider from "../../../Layout/PrimaryDivider";
const ProviderCard = ({ provider }) => {
  return (
    <div className={styles.card}>
      {/* Top Section: Logo + Rating */}
      <div className={styles.top}>
        <div className={styles.topWrapper}>
      <div className={styles.iconWrapper}>
    <img
      src={provider.icon_url}
      alt={provider.name}
      className={styles.icon}
    />
  </div>
  <div className={styles.topRight}>
    <div className={styles.providerName}>
        {provider.name}
    </div>
        <div className={styles.rating}>
          <span className={styles.score}>{provider.score}</span>
          <span className={styles.scoreLabel}>{provider.score_label}</span>
          </div>
        </div>
        </div>
      </div>

      <PrimaryDivider/>

      {/* Middle Section: Features with Icons */}
      <div className={styles.middle}>
        <div className={styles.features}>
          {provider.features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <Icon name={"circle_check"} className={styles.featureIcon} />
              <span className={styles.featureText}>{feature}</span>
            </div>
          ))}
        </div>

       
      </div>

      {/* Bottom Section: CTA Button */}
      <div className={styles.bottom}>
      <Link href={provider.url} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className={styles.a}>
            <SecondaryButton text={"Visit Site"} className={"button100"} />
          </a>
        </Link>
      </div>

    </div>
  );
};

export default ProviderCard;
