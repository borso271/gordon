import React, { useState } from "react";
import styles from "./AnalysisPart.module.css";
import SectionHeader from "../Headings/SectionHeader";

interface SummaryItem {
  label: string;
  description: string;
}

interface AnalysisPartProps {
  title: string;
  name: string;
  type: "text" | "list";
  content: SummaryItem[] | string[]; // could be summary or paragraph content
  icon: string | null;
  tagColor?: string;
  tagSize?: number;
}

const AnalysisPart: React.FC<AnalysisPartProps> = ({
  title,
  name,
  type,
  content,
  icon,
  tagColor,
  tagSize,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className={styles.responsePart}>
      <div className={styles.container}>
        <SectionHeader icon={icon} title={title} tagColor={tagColor} size={tagSize} />

        {type === "text" ? (
          <div className={styles.analysisSummaryContainer}>
            <div className={styles.summaryList}>
              <p className={styles.introText}>
                Here are the main takeaways about <strong>{name}</strong> to keep in mind:
              </p>

              {Array.isArray(content) && content.length > 0 ? (
                (expanded ? content : content.slice(0, 3)).map((item, index) => (
                  <div key={index} className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>
                      {index + 1}. {(item as SummaryItem).label}:
                    </p>
                    <p className={styles.summaryContent}>
                      {(item as SummaryItem).description}
                    </p>
                  </div>
                ))
              ) : (
                <p>No analysis data available.</p>
              )}

              {Array.isArray(content) && content.length > 3 && (
                <button className={styles.readMore} onClick={toggleExpanded}>
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.analysisPartContainer}>
            {Array.isArray(content) && content.length > 0 ? (
              (expanded ? content : content.slice(0, 3)).map((paragraph, index) => (
                <p
                  key={index}
                  className={`${styles.analysisSummary} ${styles.text} ${
                    expanded ? styles.expanded : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p>No content available.</p>
            )}

            {Array.isArray(content) && content.length > 3 && (
              <button className={styles.readMore} onClick={toggleExpanded}>
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPart;

// import React, { useState } from "react";
// import styles from "./AnalysisPart.module.css";
// import SectionHeader from "../Headings/SectionHeader";

// const AnalysisPart = ({ title, name, type, content, icon, tagColor, tagSize }) => {
//   const [expanded, setExpanded] = useState(false);
//   const toggleExpanded = () => setExpanded(!expanded);
//   // console.log("TYPE IS: ", type, " AND CONTENT IS: ", content)
//   return (
//     <div className={styles.responsePart}>
//       <div className={styles.container}>
//         {/* Header Section */}

//       <SectionHeader icon={icon} title={title} tagColor={tagColor} size={tagSize}/>

//         {/* Summary Section */}
//         {type === "text" ? (
          
//           <div  className={`${styles.analysisSummaryContainer}`}>
//   {/* Render Summary Items */}
//   <div className={styles.summaryList}>
    
//   <p className={styles.introText}>
//     Here are the main takeaways about <strong>{name}</strong> to keep in mind:
//   </p>
//     {Array.isArray(content) && content.length > 0 ? (
//       (expanded ? content : content.slice(0, 3)).map((item, index) => (
//         <div key={index} className={styles.summaryItem}>
//           <p className={styles.summaryLabel}>
//             {index + 1}. {item.label}:{' '}
//           </p>
//           <p className={styles.summaryContent}>{item.description}</p>
//         </div>
//       ))
//     ) : (
//       <p>No analysis data available.</p> // Show this if content is empty
//     )}

//     {/* Show Read More/Read Less Button if Content is Long */}
//     {Array.isArray(content) && content.length > 3 && (
//       <button className={styles.readMore} onClick={toggleExpanded}>
//         {expanded ? "Read less" : "Read more"}
//       </button>
//     )}
//   </div>
// </div>

//         ) : (
        
//           <div className={styles.analysisPartContainer}>
//   {Array.isArray(content) && content.length > 0 ? (
//     (expanded ? content : content.slice(0, 3)).map((paragraph, index) => (
//       <p key={index} className={`${styles.analysisSummary} ${styles.text} ${expanded ? styles.expanded : ""}`}>
//         {paragraph}
//       </p>
//     ))
//   ) : (
//     <p>No content available.</p> // Edge case if content is empty
//   )}

//   {/* Show Read More/Read Less Button only if content has more than 3 items */}
//   {content.length > 3 && (
//     <button className={styles.readMore} onClick={toggleExpanded}>
//       {expanded ? "Read less" : "Read more"}
//     </button>
//   )}
// </div>

//         )
        
//         }
//       </div>
//     </div>
//   );
// };

// export default AnalysisPart;
