import React from "react";
import Markdown from "react-markdown";
import ReactMarkdown from 'react-markdown';

import styles from "./AssistantMessage.module.css";
import ActionsGroup from "../../../ActionsGroup";
import copyToClipboard from "../../../../app/utils/copyToClipboard";
import shareContent from "../../../../app/utils/shareContent";
import BotHeading from "../../../Headings/BotHeading";
import { useTranslation } from 'react-i18next';
import remarkGfm from 'remark-gfm';


interface AssistantMessageProps {
  heading: string;
  text: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ heading, text }) => {
  const formattedText = text.replace(/\\n/g, "\n");
  const { t } = useTranslation();

  return (
    <div className={styles.fullResponse}>
      <BotHeading> <Markdown>{heading}</Markdown></BotHeading>

      {text && (
        <div className={styles.assistantMessage}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedText}</ReactMarkdown>
        </div>
      )}

    
    </div>
  );
};

export default AssistantMessage;



  {/* <ActionsGroup
        actions={[
          { iconName: "share", text: t("share"), onClick: () => shareContent(text) },
          { iconName: "copy", text: t("copy"), onClick: () => copyToClipboard(text) },
        ]}
      /> */}