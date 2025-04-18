import React from "react";
import styles from "./KnowledgeFolder.module.css";
import Icon from "../../../../../../components/Icons/Icon";

interface KnowledgeFolderProps {
  iconName: string;
  title: string;
  subtext: string;
  onClick?: () => void;
}

const KnowledgeFolderItem: React.FC<KnowledgeFolderProps> = ({
  iconName = "book",
  title,
  subtext,
  onClick,
}) => {
  return (
    <div className={styles.folderItem} onClick={onClick}>
      <Icon name={iconName} size={18} />
      <div className={styles.textGroup}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtext}>{subtext}</div>
      </div>
    </div>
  );
};

export default KnowledgeFolderItem;
