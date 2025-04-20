import React from "react";
import ToggleList from "../../ToggleList";
import NewsItem from "../components/NewsItem";
import styles from "./NewsToggleList.module.css";

import { useTranslation } from "react-i18next";

interface NewsCompleteData {
    title: string;
    author: string;
    url: string;
    summary:string;
    publishedDate: string;
    image?: string;
    favicon?: string;
  }
  
interface NewsToggleListProps {
  news: NewsCompleteData[];
  titleKey: string;

}

const NewsToggleList: React.FC<NewsToggleListProps> = ({ news, titleKey}) => {
  const { t } = useTranslation();

  if (!news || news.length === 0) return null;

  return (
    <ToggleList title={t(titleKey)} divider={false}>
      {news.map((item, index) => (
        <NewsItem key={index} item={item} />
      ))}
    </ToggleList>
  );
};

export default NewsToggleList;
