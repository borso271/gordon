"use client"

import React from 'react';
import styles from './page.module.css'
import { useTranslation } from 'react-i18next';
import { PrimaryHeading } from '../../../components/Headings/PrimaryHeading';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import InactiveButton from '../../../components/Buttons/InactiveButton';
import {Subheading} from '../../../components/Headings/Subheading'
import Link from "next/link";

const MarketingPage = () => {
  const { t } = useTranslation();
  const headingText = t("homepage_heading");

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        
        <InactiveButton text={t("powered_by_ai")} icon={"gordon_logo"} />
        <PrimaryHeading>
        {headingText}
        </PrimaryHeading>
        <Subheading>
        {t("homepage_subheading")}
        </Subheading>
        
       <div className={styles.button}>
       <Link href="/landing">
  <PrimaryButton text={t("get_started")} icon={"right_arrow"} />
</Link>
</div>
      </div>
    </div>
  );
};

export default MarketingPage;
