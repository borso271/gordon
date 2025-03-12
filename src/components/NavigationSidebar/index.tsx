// Let's improve this component: 
// you have always only 8 items visible, if there are more than 8, the older ones are rendered but not visible if not on scroll.
// Since the sidebar is scrollable.
// we import from conversationContext these two:   const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
// and the idea is that the item in conversationPairs with currentIndex has an active class.
// Also, clicking on another item in the navigation, set currentIndex

import React, { useMemo } from "react";
import styles from "./NavigationSidebar.module.css";
import NavigationItem from "./components/NavigationItem";
import { useConversation } from "../../app/context/conversationContext"; // ✅ Import context

const VISIBLE_ITEMS = 8; // ✅ Always show 8 items

const NavigationSidebar: React.FC = () => {
  const { conversationPairs, currentIndex, setCurrentIndex } = useConversation();

  // ✅ Only show the last 8 items
  const visibleItems = useMemo(() => {
    return conversationPairs.slice(-VISIBLE_ITEMS);
  }, [conversationPairs]);

  return (
    <div className={styles.sidebar}>
      {visibleItems.map((item, index) => {
        // ✅ Get correct index from `conversationPairs`
        const realIndex = conversationPairs.length - visibleItems.length + index;

        return (
          <NavigationItem
            key={item.id}
            label={item.user}
            index={item.id}
            isSelected={currentIndex === realIndex} // ✅ Highlight active item
            onSelect={() => setCurrentIndex(realIndex)} // ✅ Click updates currentIndex
          />
        );
      })}
    </div>
  );
};

export default NavigationSidebar;

