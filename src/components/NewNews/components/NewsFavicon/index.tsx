
import Icon from "../../../Icons/Icon";
import styles from "./NewsFavicon.module.css";
import React, { useEffect, useState } from "react";


interface NewsFaviconProps {
  url?: string | null;
}

const NewsFavicon: React.FC<NewsFaviconProps> = ({ url }) => {
  const [isValidImage, setIsValidImage] = useState<boolean>(false);

  useEffect(() => {
    if (!url || typeof url !== "string" || url.trim().length === 0) {
      setIsValidImage(false);
      return;
    }

    const img = new Image();
    img.src = url;
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
  }, [url]);

  return (
    <div className={styles.wrapper}>
      {isValidImage ? (
        <img src={url!} alt="favicon" className={styles.favicon} />
      ) : (
        <Icon name="news_favicon" />
      )}
    </div>
  );
};

export default NewsFavicon;
