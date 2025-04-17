import React from "react";
import Icon from "../../../Icons/Icon";
import styles from "./NewsFavicon.module.css";

interface NewsFaviconProps {
  url?: string | null;
}

const NewsFavicon: React.FC<NewsFaviconProps> = ({ url }) => {
  const isValidUrl = url && typeof url === "string" && url.trim().length > 0;

  return (
    <div className={styles.wrapper}>
      {isValidUrl ? (
        <img src={url} alt="favicon" className={styles.favicon} />
      ) : (
        <Icon name="news_favicon" />
      )}
    </div>
  );
};

export default NewsFavicon;
