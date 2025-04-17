import React from "react";
import NewsItem from "../components/NewsItem";
import styles from "./NewsList.module.css"; // optional, if you have specific styles

interface NewsCompleteData {
  title: string;
  author: string;
  url: string;
  summary: string;
  publishedDate: string;
  image?: string;
  favicon?: string;
}

interface NewsListProps {
    data: NewsCompleteData[];
}

const NewsList: React.FC<NewsListProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className={styles.newsList}>
        
      {data.map((item, index) => (
        <div key={index} className={styles.newsItemWrapper}>
        <NewsItem key={index} item={item} /></div>
      ))}
    </div>
  );
};

export default NewsList;
