import React from "react";

import ReactMarkdown from 'react-markdown';



import styles from "./AssistantMessage.module.css";

import { useTranslation } from 'react-i18next';
import remarkGfm from 'remark-gfm';


interface AssistantMessageProps {
  heading: string;
  text: string;
}
const formatLinks = (text: string): string => {
  let count = 1;

  // Step 1: Replace all [text](url) with numbered links
  const numberedText = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, __, url) => `[${count++}](${url})`
  );

  // Step 2: Replace list items like "- [1](url)" or "- **Read more**: [1](url)" with just the link + newline
  const cleanedText = numberedText.replace(
    /^[\s\t]*[-*+]\s+(?:\*\*Read[^\n]*\*\*:)?\s*(\[\d+\]\([^)]+\))\s*$/gmi,
    (_, link) => `${link}\n` // ✅ force line break after
  );

  return cleanedText;
};

// const formatLinks = (text) => {
//   let count = 1;

//   // Replace all links with numbered links
//   const numberedText = text.replace(
//     /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
//     (_, __, url) => `[${count++}](${url})`
//   );

//   // Remove "- [n](link)" or "* [n](link)" from list format
//   const cleanedText = numberedText.replace(
//     /^[\s\t]*[-*+]\s+(\[\d+\]\([^)]+\))\s*$/gm,
//     (_, link) => link
//   );

//   return cleanedText;
// };


const AssistantMessage: React.FC<AssistantMessageProps> = ({ heading, text }) => {
  const formattedText1 = text.replace(/\\n/g, "\n");
  const formattedText = formatLinks(formattedText1)
  const { t } = useTranslation();


  return (
    <div className={styles.fullResponse}>
      {text && (
        <div className={styles.assistantMessage}>
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="circularLink"
        {...props}
      >
        {children}
      </a>
    ),
    table: ({ node, ...props }) => (
      <table className="myStyledTable" {...props} />
      
    ),
  }}
>
  {formattedText}
</ReactMarkdown>

        </div>
      )}

    </div>
  );
};

export default AssistantMessage;
