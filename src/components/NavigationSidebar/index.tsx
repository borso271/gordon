
// import React, { useMemo } from "react";

// import styles from "./NavigationSidebar.module.css";
// import NavigationItem from "./components/NavigationItem";
// import { useConversation } from "../../app/context/conversationContext"; // ✅ Import context

// const VISIBLE_ITEMS = 8;

// const NavigationSidebar: React.FC = () => {
//   const { conversationPairs, currentIndex, setCurrentIndex, setAreNavigationItemsVisible } = useConversation();

//   const visibleItems = useMemo(() => {
//     return conversationPairs; // show all items
//   }, [conversationPairs]);

  
//   if (conversationPairs.length < 2){
//     return <></>
//   }
//   return (

//     <div className={styles.sidebar}>
//       {visibleItems.map((item, index) => {
//         const realIndex = conversationPairs.length - visibleItems.length + index;
      
//         return (
//           <NavigationItem
//             key={item.id}
//             label={item.user}
//             index={item.id}
//             isSelected={currentIndex === realIndex} // ✅ Highlight active item
//             isEdgeItem={conversationPairs.length > 8 && (index === 0 || index === visibleItems.length - 1)} // ✅ First & last items are edge items
//             onSelect={() => setCurrentIndex(realIndex)} // ✅ Click updates currentIndex
//             useVisibilityControl={true}
//           />
//         );
//       })}
        
//     </div>
//   );
// };

// export default NavigationSidebar;



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
              index={item.id}
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
