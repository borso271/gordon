import React from "react";
import Markdown from "react-markdown";
import styles from "./AssistantMessage.module.css";
import ActionsGroup from "../../../ActionsGroup";
import copyToClipboard from "../../utils/copyToClipboard";
import shareContent from "../../utils/shareContent";
import BotHeading from "../../../Headings/BotHeading";

interface AssistantMessageProps {
  heading: string;
  text: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ heading, text }) => {
  const formattedText = text.replace(/\\n/g, "\n");

  return (
    <div className={styles.fullResponse}>
      <BotHeading>{heading}</BotHeading>

      {text && (
        <div className={styles.assistantMessage}>
          <Markdown>{formattedText}</Markdown>
        </div>
      )}

      <ActionsGroup
        actions={[
          { iconName: "share", text: "Share", onClick: () => shareContent(text) },
          { iconName: "copy", text: "Copy", onClick: () => copyToClipboard(text) },
        ]}
      />
    </div>
  );
};

export default AssistantMessage;
