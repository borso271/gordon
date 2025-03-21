import React, { useMemo, useEffect, useRef } from "react";
import styles from "./NavigationSidebar.module.css";
import NavigationItem from "./components/NavigationItem";
import { useConversation } from "../../app/context/conversationContext"; // ✅ Import context

const NavigationSidebar: React.FC = () => {
  const { conversationPairs, currentIndex, setCurrentIndex } = useConversation();

  // Reference for sidebar container
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Detect new messages and scroll to bottom
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }
  }, [conversationPairs.length]); // Runs when conversationPairs length changes

  const visibleItems = useMemo(() => {
    return conversationPairs; // Show all items
  }, [conversationPairs]);

  if (conversationPairs.length < 2) {
    return null;
  }

  return (
    <div className={styles.sidebarContainer}>
      {/* Fixed fade effect at the top */}
      <div className={styles.fadeTop}></div>
  
      {/* Scrollable content */}
      <div ref={sidebarRef} className={styles.sidebar}>
        {visibleItems.map((item, index) => {
          return (
            <NavigationItem
              key={item.id}
              label={item.user}
              // index={item.id}
              isSelected={currentIndex === index}
              onSelect={() => setCurrentIndex(index)}
             
            />
          );
        })}
      </div>

      {/* Fixed fade effect at the bottom */}
      <div className={styles.fadeBottom}></div>
    </div>
  );
}  

export default NavigationSidebar;
