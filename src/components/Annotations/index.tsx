import React from "react";
import NewsItem from "../NewNews/components/NewsItem";
import styles from './Annotations.module.css'
import { useTranslation } from "react-i18next";
interface NewsCompleteData {
  title: string;
  author: string;
  url: string;
  summary: string;
  publishedDate: string;
  image?: string;
  favicon?: string;
}

interface AnnotationsProps {
  data: NewsCompleteData[];
}

 const Annotations: React.FC<AnnotationsProps> = ({ data }) => {
    const { t } = useTranslation();
  
    if (!Array.isArray(data) || data.length === 0) return null;
  
    const sourceCount = data.length;
    const titleKey = sourceCount === 1
      ? t("based_on_n_sources.one", { count: sourceCount })
      : t("based_on_n_sources.other", { count: sourceCount });
  
    return (
      <div className={styles.container}>
        <h3>{titleKey}</h3>
        <div className={styles.itemsContainer}>
          {data.map((item, index) => (
            <div key={index} className={styles.annotationWrapper}>
              <NewsItem item={item} annotationNumber={index + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default Annotations