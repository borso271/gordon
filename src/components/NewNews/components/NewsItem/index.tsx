import React, {useState} from 'react';
import styles from './NewsItem.module.css';

import { formatAuthor } from './extract_author';
import NewsFavicon from '../NewsFavicon';
import AnnotationNumber from './AnnotationNumber';
interface NewsCompleteData {
  title: string;
  author: string;
  url: string;
  summary:string;
  publishedDate: string;
  image?: string;
  favicon?: string;
}

interface NewsCompleteData {
  title: string;
  author: string;
  url: string;
  summary: string;
  publishedDate: string;
  image?: string;
  favicon?: string;
}

interface NewsItemProps {
  item: NewsCompleteData;
  annotationNumber?: number; // Optional
}

const NewsItem: React.FC<NewsItemProps> = ({ item, annotationNumber }) => {
  const { title, author, summary, image, favicon, url } = item;
  const formattedAuthor = formatAuthor(author, url);

  const [imgError, setImgError] = useState(false);



  const isValidImage = typeof image === "string" && image.startsWith("https");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkWrapper}
    >
      <div className={styles.wrapper}>
        <div className={styles.textColumn}>
        <h3 className={styles.label}>

  {annotationNumber !== undefined && (
    <AnnotationNumber number={annotationNumber} />
  )}
  {/* Wrap title in a span */}
{title}
</h3>
          <p className={styles.description}>{summary}</p>
          <div className={styles.source}>
            <NewsFavicon url={favicon} />
            <span className={styles.sourceText}>{formattedAuthor}</span>
          </div>
        </div>

        {/* {isValidImage && (
          <div className={styles.imageColumn}>
            <img src={image} alt={title} className={styles.image} />
          </div>
        )} */}



{isValidImage && !imgError && (
          <div className={styles.imageColumn}>
            <img src={image} alt={title} className={styles.image}  onError={() => setImgError(true)}/>
          </div>
        ) }



      </div>
    </a>
  );
};

export default NewsItem;


// interface NewsItemProps {
//   item: NewsCompleteData;
// }
// const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
//   const { title, author, summary, image, favicon, url } = item;
//   const formattedAuthor = formatAuthor(author, url);
//   const isValidImage = typeof image === "string" && image.startsWith("https");

//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={styles.linkWrapper} // You can use this to style the anchor if needed
//     >
//       <div className={styles.wrapper}>
//         <div className={styles.textColumn}>
//           <h3 className={styles.label}>{title}</h3>
//           <p className={styles.description}>{summary}</p>
//           <div className={styles.source}>
//             <NewsFavicon url={favicon} />
//             <span className={styles.sourceText}> {formattedAuthor}</span>
//           </div>
//         </div>

//         {isValidImage && (
//           <div className={styles.imageColumn}>
//             <img src={image} alt={title} className={styles.image} />
//           </div>
//         )}
//       </div>
//     </a>
//   );
// };

// export default NewsItem;
