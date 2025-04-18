import React from "react";
import KnowledgeItem from "../KnowledgeItem";
import styles from "./KnowledgeItemList.module.css";
import CircledIconButton from "../../../../../../components/Buttons/CircleActionButton";
import MainSidebarHeading from "../../../../../../components/Headings/MainSidebarHeading";
interface KnowledgeItemListProps {
  items: {
    iconName: string;
    text: string;
  }[];
  title: string;
  onItemClick: (text: string) => void;
}

const KnowledgeItemList: React.FC<KnowledgeItemListProps> = ({ items,title, onItemClick }) => {
  return (
    <div className={styles.container}>
        <div className={styles.listHeader}>
            
        <CircledIconButton onClick={function (): void {
                  throw new Error("Function not implemented.");
              } } iconName={"chevron_left"}            
          />

          <MainSidebarHeading text={title}/>
          

        </div>
    <div className={styles.list}>
      {items.map((item, index) => (
        <KnowledgeItem
          key={index}
          iconName={item.iconName}
          text={item.text}
          onClick={onItemClick}
        />
      ))}
    </div>
    </div>
  );
};

export default KnowledgeItemList;
