import React, { useMemo } from "react";
import styles from "./MobileNavigation.module.css";
import NavigationItem from "../NavigationSidebar/components/NavigationItem";
import { useConversation } from "../../app/context/conversationContext"; // ✅ Import context

const VISIBLE_ITEMS = 8; // ✅ Always show 8 items

const MobileNavigation: React.FC = () => {
  const { conversationPairs, currentIndex, setCurrentIndex } = useConversation();
  // ✅ Only show the last 8 items
  const visibleItems = useMemo(() => {
    return conversationPairs.slice(-VISIBLE_ITEMS);
  }, [conversationPairs]);

  return (
    <>
   
    <div
      className={styles.navigationContainer}
     
    >
        <div className={styles.header}>
            History
        </div>
        
        <div className={styles.itemList}>
      {visibleItems.map((item, index) => {
        const realIndex = conversationPairs.length - visibleItems.length + index;
        
        return (
          <NavigationItem
            key={item.id}
            label={item.user}
            index={item.id}
            isSelected={currentIndex === realIndex} // ✅ Highlight active item
            isEdgeItem={visibleItems.length > 8 && (index === 0 || index === visibleItems.length - 1)} // ✅ First & last items are edge items
            onSelect={() => setCurrentIndex(realIndex)} // ✅ Click updates currentIndex
          />
        );
      })}
    </div>
    </div>
    </>
  );

};

export default MobileNavigation;
