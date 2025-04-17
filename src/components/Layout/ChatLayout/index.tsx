// components/LayoutWithNavbar.tsx
import {useState} from "react";
import styles from './ChatLayout.module.css'
import ChatNavigationSidebar from "../../ChatNavigationSidebar";
import ChatNavBar from "../ChatNavbar";

// import { useChatNavigationSidebar } from "../../../app/context/chatNavigationContext";

type Suggestion = {
  label: string;
  prompt: string;
};

interface LayoutWithNavbarProps {
  suggestions?: Suggestion[];
  children: React.ReactNode;
}

const ChatLayout: React.FC<LayoutWithNavbarProps> = ({ children }) => {
    
const [chatSidebarExpanded, setChatSidebarExpanded] = useState(false);

return (
    <div className={styles.layout}>
   
      <div className={`${styles.sidebar} ${chatSidebarExpanded ? styles.visible : styles.hidden}`}>
  <ChatNavigationSidebar
    onToggle={() => setChatSidebarExpanded(!chatSidebarExpanded)}
    expanded={chatSidebarExpanded}
  />
</div>
      {/* Right column: navbar on top, main content below */}
      <div className={styles.rightPanel}>
        <div className={styles.navbar}>
          <ChatNavBar   onToggle={() => setChatSidebarExpanded(!chatSidebarExpanded)} expanded={chatSidebarExpanded}/>
        </div>

        <div className={styles.mainContent}>
          {children}
        </div>
      </div>
    </div>
  );

}  

export default ChatLayout