import React from "react";
import KnowledgeFolderItem from "../KnowledgeFolder";
import styles from './KnowledgeFolderList.module.css'
import MainSidebarHeading from "../../../../../../components/Headings/MainSidebarHeading";
interface FolderItem {
  iconName: string;
  title: string;
  subtext: string;
  onClick?: () => void;
}

interface KnowledgeFolderListProps {
  items: FolderItem[];
}

const KnowledgeFolderList: React.FC<KnowledgeFolderListProps> = ({ items }) => {
  return (
    <div className={styles.container}>
        <MainSidebarHeading text={"Our Library:"}/>
    <div className={styles.list}>
      {items.map((item, index) => (
        <KnowledgeFolderItem
          key={index}
          iconName={item.iconName}
          title={item.title}
          subtext={item.subtext}
          onClick={item.onClick}
        />
      ))}
    </div>
    </div>
  );
};

export default KnowledgeFolderList;
