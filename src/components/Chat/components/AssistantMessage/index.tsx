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

  /* 1️⃣ Replace every [text](url) with numbered links */
  const numbered = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, __, url) => `[${count++}](${url})`
  );

  /* 2️⃣ Strip bullet characters like  "- [1](…)"  or
         "- **Read more**: [1](…)" and keep only the link */
  const noBullets = numbered.replace(
    /^[\s\t]*[-*+]\s+(?:\*\*Read[^\n]*\*\*:)?\s*(\[\d+\]\([^)]+\))\s*$/gim,
    (_, link) => `${link}\n`
  );

  /* 3️⃣ Remove any single line‑break **immediately** before a link.
         This prevents ReactMarkdown from turning it into a <br> */
  const noBreakBeforeLink = noBullets
    //  \n[1](url)   →  [1](url)
    .replace(/\n(\s*\[\d+\]\([^)]+\))/g, " $1")
    //  <br>[1](url) →  [1](url)   (for safety if <br> is in the source)
    .replace(/<br\s*\/?>\s*(\[\d+\]\([^)]+\))/gi, " $1");

  return noBreakBeforeLink;
};

const AssistantMessage: React.FC<AssistantMessageProps> = ({ heading, text }) => {
  const formattedText1 = text.replace(/\\n/g, "\n");
  const formattedText = formatLinks(formattedText1)
  // const { t } = useTranslation();


  return (
    <div className={styles.fullResponse}>
      {text && (
        <div className={styles.assistantMessage}>
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{

    a: ({ href, children, ...props }) => {
      // If it's an email, don't render as link
      if (href?.startsWith("mailto:")) {
        return <span {...props}>{children}</span>;
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="circularLink"
          {...props}
        >
          {children}
        </a>
      );},

  
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


  // a: ({ href, children, ...props }) => (
    //   <a
    //     href={href}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //     className="circularLink"
    //     {...props}
    //   >
    //     {children}
    //   </a>
    // ),