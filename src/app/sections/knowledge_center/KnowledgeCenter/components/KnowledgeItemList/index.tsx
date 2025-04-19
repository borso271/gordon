import React from "react";
import KnowledgeItem from "../KnowledgeItem";
import styles from "./KnowledgeItemList.module.css";
import CircledIconButton from "../../../../../../components/Buttons/CircleActionButton";
import MainSidebarHeading from "../../../../../../components/Headings/MainSidebarHeading";
import { useManualSubmit } from "../../../../../hooks/useManualSubmit";
import { useConversation } from "../../../../../context/conversationContext";
interface KnowledgeItemListProps {
  title: string;
  items: { iconName?: string; text: string }[];
  onBack: () => void;
}

const KnowledgeItemList: React.FC<KnowledgeItemListProps> = ({
  title,
  items,
  onBack,
}) => {
  const { submitQuery } = useManualSubmit();

  const {threadId} = useConversation();
  const handleItemClick = (text: string) => {
    submitQuery(text, false, threadId); // 🔁 reuse the shared handler
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CircledIconButton iconName="chevron_left" onClick={onBack} />
        <MainSidebarHeading text={title} />
      </div>

      <div className={styles.list}>
        {items.map((item, idx) => (
          <KnowledgeItem
            key={idx}
            iconName={item.iconName}
            text={item.text}
            onClick={() => handleItemClick(item.text)}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeItemList;


// const KnowledgeItemList: React.FC<KnowledgeItemListProps> = ({ items,title, onItemClick }) => {
//   return (
//     <div className={styles.container}>
//         <div className={styles.listHeader}>

//         <CircledIconButton onClick={function (): void {
//                   throw new Error("Function not implemented.");
//               } } iconName={"chevron_left"}            
//           />

//           <MainSidebarHeading text={title}/>
          

//         </div>
//     <div className={styles.list}>
//       {items.map((item, index) => (
//         <KnowledgeItem
//           key={index}
//           iconName={item.iconName}
//           text={item.text}
//           onClick={onItemClick}
//         />
//       ))}
//     </div>
//     </div>
//   );
// };

// export default KnowledgeItemList;
