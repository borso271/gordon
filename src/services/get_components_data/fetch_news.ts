import supabase_client from "../../lib/supabaseClient";
import fetch_symbol_info from "../../utils/fetch_symbol_info";

interface NewsArticle {
    id: number;
    article_id: string;
    publisher_name: string;
    title: string;
    author: string;
    published_utc: string;
    article_url: string;
    image_url: string;
    description: string;
  }
  
  interface NewsTicker {
    sentiment: string;
    sentiment_reasoning: string;
    news_articles: NewsArticle;
  }

  
export async function getNewsForSymbol(ticker_symbol: string) {
  const { id: symbol_id } = await fetch_symbol_info(ticker_symbol) || {};

  if (!symbol_id) throw new Error(`Symbol ID not found for ${ticker_symbol}`);

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
    .eq("symbol_id", symbol_id) as unknown as { data: NewsTicker[]; error: any };

    // .eq("symbol_id", symbol_id);

  if (error) throw new Error(`Error fetching news: ${error.message}`);

  if (!data || data.length === 0) return [];

  const sortedNews = data
    .filter(item => item.news_articles)
    .sort(
      (a, b) =>
        new Date(b.news_articles.published_utc).getTime() -
        new Date(a.news_articles.published_utc).getTime()
    )
    .slice(0, 5);

  return sortedNews.map(item => ({
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
}
