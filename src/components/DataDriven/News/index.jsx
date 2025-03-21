
import React from "react";
import styles from './News.module.css';
import SmallImage from "../../SmallImage";
import PrimaryDivider from "../../Layout/PrimaryDivider";
import SectionHeader from "../../Headings/SectionHeader";
import NewsLoader from "../../Loaders/NewsLoader";
import { useTickerNews } from "../../../app/hooks/useTickerNews";

const TickerNews = ({ ticker_symbol }) => {
  const { news, loading, error } = useTickerNews(ticker_symbol);

  if (loading) return <NewsLoader />;
  if (error) return <p>❌ {error}</p>;
  if (news.length === 0) return <p>No news found.</p>;

  return (
      <div className={styles.newsWrapper}>
        {/* First Row: Section Title */}
        <SectionHeader title={"Latest News"} icon={"news_icon"} size={24}/>
        {/* Second Row: News Container */}
        <div className={styles.newsContainer}>
          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>❌ {error}</p>}
  
          {news.length > 0 ? (
            <div className={styles.newsContent}>
              {news.slice(0, 3).map((article, index) => (
                <React.Fragment key={article.id}>
                  <div className={styles.newsCard}>
                    {/* Left: Small Image */}
                    <div className={styles.newsImage}>
                    <SmallImage url={article.image} alt={article.title} x={44} />
                    </div>
                    {/* Right: Date & Title */}
                    <div className={styles.newsText}>
                      <p className={styles.newsDate}>
                        {article.publisher} • {article.published_at}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.newsTitle}
                      >
                        {article.title}
                      </a>
                    </div>
                  </div>
  
                  {/* Divider Between News Items (Not After Last Item) */}
                  {index < news.slice(0, 3).length - 1 && (
                    <div className={styles.dividerWrapper}>
                      <PrimaryDivider />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className={styles.noNews}>No recent news available.</p>
          )}
        </div>
      </div>
    );

};

export default TickerNews;
