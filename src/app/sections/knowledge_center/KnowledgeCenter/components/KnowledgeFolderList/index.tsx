
"use client";
import React, { useState } from "react";

import KnowledgeFolderItem from "../KnowledgeFolder";
import styles from './KnowledgeFolderList.module.css'
import MainSidebarHeading from "../../../../../../components/Headings/MainSidebarHeading";
import { KnowledgeTopic } from "../../../knowledge_data";
import KnowledgeItemList from "../KnowledgeItemList";
import { useTranslation } from "react-i18next";

interface Props {
  folders: KnowledgeTopic[];
}


interface KnowledgeFolderListProps {
  folders: {
    id: string;
    iconName: string;
    titleKey: string;
    subtextKey: string;
    items: { iconName?: string; textKey: string; onClick?: () => void }[];
  }[];
}

const KnowledgeFolderList: React.FC<KnowledgeFolderListProps> = ({ folders }) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (activeId) {
    const folder = folders.find((f) => f.id === activeId)!;

    return (
      <KnowledgeItemList
        title={t(folder.titleKey)}
        items={folder.items.map((itm) => ({
          iconName: itm.iconName,
          text: t(itm.textKey),
          onClick: itm.onClick,
        }))}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <MainSidebarHeading text={t("knowledge.library_title")} />
      <div className={styles.list}>
        {folders.map((folder) => (
          <KnowledgeFolderItem
            key={folder.id}
            iconName={folder.iconName}
            title={t(folder.titleKey)}
            subtext={t(folder.subtextKey)}
            onClick={() => setActiveId(folder.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeFolderList;

// const KnowledgeFolderList: React.FC<Props> = ({ folders }) => {
//   const { t } = useTranslation();
//   const [activeId, setActiveId] = useState<string | null>(null);

//   /* ----------------------- RENDER ITEM LIST ----------------------- */
//   if (activeId) {
//     const folder = folders.find((f) => f.id === activeId)!;

//     return (
//       <div className={styles.container}>
//         {/* Header with back button */}
//         <div className={styles.listHeader}>
//           <CircledIconButton
//             iconName="chevron_left"
//             onClick={() => setActiveId(null)}
//           />
//           <MainSidebarHeading text={t(folder.titleKey)} />
//         </div>

//         {/* Items */}
//         <div className={styles.list}>
//           {folder.items.map((itm, idx) => (
//             <KnowledgeItem
//               key={idx}
//               iconName={itm.iconName}
//               text={t(itm.textKey)}
//               onClick={itm.onClick}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* ----------------------- RENDER FOLDER GRID -------------------- */
//   return (
//     <div className={styles.container}>
//       <MainSidebarHeading text={t("knowledge.library_title")} />

//       <div className={styles.list}>
//         {folders.map((folder) => (
//           <KnowledgeFolderItem
//             key={folder.id}
//             iconName={folder.iconName}
//             title={t(folder.titleKey)}
//             subtext={t(folder.subtextKey)}
//             onClick={() => setActiveId(folder.id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default KnowledgeFolderList;
