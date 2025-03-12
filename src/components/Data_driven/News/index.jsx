import { useEffect, useState } from "react";
import React from "react";
import fetch_symbol_info from "../../../utils/fetch_symbol_info";
import supabase_client from "../../../lib/supabaseClient";
import styles from './News.module.css';
import SmallImage from "../../SmallImage";
import PrimaryDivider from "../../Layout/PrimaryDivider";
import SecondaryH2 from "../../Headings/SecondaryH2"
const TickerNews = ({ ticker_symbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker_symbol) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Fetch the symbol_id for the given ticker_symbol
        const { id: symbol_id } = await fetch_symbol_info(ticker_symbol) || {};

        if (!symbol_id) throw new Error(`Symbol ID not found for ${ticker_symbol}`);

        // 2️⃣ Fetch the latest news articles for the given symbol_id
        const { data, error } = await supabase_client
          .from("news_ticker")
          .select(
            `
            news_id, sentiment, sentiment_reasoning,
            news_articles (
              id, article_id, publisher_name, title, author, published_utc, 
              article_url, image_url, description
            )
          `
          )
          .eq("symbol_id", symbol_id); // ✅ No `.order()` here

        if (error) throw new Error(`Error fetching news: ${error.message}`);

        if (!data || data.length === 0) {
          setNews([]);
          return;
        }

        // ✅ Sort manually in JavaScript by `published_utc`
        const sortedNews = data
          .filter(item => item.news_articles) // Remove entries without news_articles
          .sort((a, b) => new Date(b.news_articles.published_utc) - new Date(a.news_articles.published_utc)) // Newest first
          .slice(0, 5); // ✅ Limit to 5

        // ✅ Format news articles
        const formattedNews = sortedNews.map((item) => ({
          id: item.news_articles.id,
          publisher: item.news_articles.publisher_name,
          title: item.news_articles.title,
          author: item.news_articles.author,
          published_at: new Date(item.news_articles.published_utc).toLocaleString(),
          url: item.news_articles.article_url,
          image: item.news_articles.image_url,
          description: item.news_articles.description,
          sentiment: item.sentiment,
          sentiment_reasoning: item.sentiment_reasoning,
        }));

        setNews(formattedNews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [ticker_symbol]);

  return (
   
      <div className={styles.newsWrapper}>
        {/* First Row: Section Title */}
        <SecondaryH2>Latest News</SecondaryH2>
  
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
  //     <div className={styles.newsWrapper}>
  //       {/* First Row: Section Title */}
  //       <SecondaryH2>Latest News</SecondaryH2>
  
  //       {/* Second Row: News Container */}
  //       <div className={styles.newsContainer}>
  //         {loading && <p className={styles.loading}>Loading...</p>}
  //         {error && <p className={styles.error}>❌ {error}</p>}
  
  //         {news.length > 0 ? (
  //           <div className={styles.newsContent}>
  //             {news.slice(0, 3).map((article, index) => (
  //               <div key={article.id} className={styles.newsItem}>
  //                 <div className={styles.newsCard}>
  //                   {/* Left: Small Image */}
  //                   <div className={styles.newsImage}>
  //                   <SmallImage url={article.image} alt={article.title} x={44} />
  // </div>
  //                   {/* Right: Date & Title */}
  //                   <div className={styles.newsText}>
  //                     <p className={styles.newsDate}>
  //                       {article.publisher} • {article.published_at}
  //                     </p>
  //                     <a
  //                       href={article.url}
  //                       target="_blank"
  //                       rel="noopener noreferrer"
  //                       className={styles.newsTitle}
  //                     >
  //                       {article.title}
  //                     </a>
  //                   </div>
  //                 </div>
  
  //                 {/* Divider Between News Items (Not After Last Item) */}
  //                 {index < news.slice(0, 3).length - 1 && <PrimaryDivider />}
  //               </div>
  //             ))}
  //           </div>
  //         ) : (
  //           <p className={styles.noNews}>No recent news available.</p>
  //         )}
  //       </div>
  //     </div>
  //   );
};

export default TickerNews;
