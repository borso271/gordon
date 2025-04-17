import React from 'react';
import styles from './LatestNews.module.css';
import NewsItem from './components/NewsItem';
import PrimaryDivider from '../Layout/PrimaryDivider';

interface NewsCompleteData {
  title: string;
  author: string;
  url: string;
  summary:string;
  publishedDate: string;
  image?: string;
  favicon?: string;
}

interface LatestNewsProps {
  news: NewsCompleteData[];
  title:string;
}

const LatestNews: React.FC<LatestNewsProps> = ({ news, title}) => {
  if (!news || news.length === 0) return null;

  return (
    <div className={styles.wrapper}>
        <h3 className={styles.title}>{title}</h3>
       
        <PrimaryDivider></PrimaryDivider>
        <div className={styles.items}>
      {news.map((item, index) => (
        <NewsItem key={index} item={item} />
      ))}
    </div></div>
  );
};

export default LatestNews;
