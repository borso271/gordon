import React from "react";
import AssetWithInsight from "./AssetWithInsight";
import styles from "./AssetsWithInsight.module.css";
import { useTranslation } from "react-i18next";

type AssetsWithInsightProps = {
    data: any[];
};


const AssetsWithInsight: React.FC<AssetsWithInsightProps> = ({ data }) => {
  const { t } = useTranslation();
console.log("data is: ", data)
  return (
    <div className={styles.container}>
 <h2 className={styles.title}>{t("asset.suggested_assets", "Suggested Assets")}</h2>
<div className={styles.itemsContainer}>
      {data.map((item, index) => (
      <div key={item.id ?? index}>
          <AssetWithInsight item={item} />
        </div>
      ))}
       </div>

     
    </div>
  );
};

export default AssetsWithInsight;
