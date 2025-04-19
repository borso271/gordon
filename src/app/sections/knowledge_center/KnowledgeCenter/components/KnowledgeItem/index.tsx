import React from "react";
import styles from "./KnowledgeItem.module.css"; // Optional styling
import Icon from "../../../../../../components/Icons/Icon";

interface KnowledgeItemProps {
  iconName?: string;
  text: string;
  onClick?: (text: string) => void;
}

const KnowledgeItem: React.FC<KnowledgeItemProps> = ({ iconName="lamp", text, onClick }) => {
  return (
    <div className={styles.item} onClick={() => onClick(text)}>
      <Icon name={iconName} size={18} className={styles.icon} />
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default KnowledgeItem;
