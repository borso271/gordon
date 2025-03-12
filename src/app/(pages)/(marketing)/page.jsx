"use client"

import React from 'react';
import styles from './page.module.css'
import { useTranslation } from 'react-i18next';
import { PrimaryHeading } from '../../../components/Headings/PrimaryHeading/index.jsx';
import PrimaryButton from '../../../components/Buttons/PrimaryButton/index.jsx';
import InactiveButton from '../../../components/Buttons/InactiveButton/index.jsx';
import {Subheading} from '../../../components/Headings/Subheading'
import Link from "next/link";

const MarketingPage = () => {
  const { t } = useTranslation();
  //const router = useRouter(); // Initialize useRouter
  const headingText = t("homepage_heading");

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        
        <InactiveButton text={t("powered_by_ai")} icon={"powered"} />
        <PrimaryHeading>
          {headingText}
        </PrimaryHeading>
        <Subheading>
        {t("homepage_subheading")}
         
        </Subheading>
        
      
      <div className={styles.button}>
<Link href="/chat">
  <PrimaryButton text={t("get_started")} icon={"right_arrow"} />
</Link>
</div>
      </div>
    </div>
  );
};

export default MarketingPage;
