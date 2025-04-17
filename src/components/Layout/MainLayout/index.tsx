// components/LayoutWithNavbar.tsx
import {useState} from "react";
import Navbar from "../Navbar";
import SuggestionsTopBar from "../../SuggestionsTopBar";
import styles from './LaytoutWithNavbar.module.css'
import MainNavSidebar from "../../MainNavSidebar";

type Suggestion = {
  label: string;
  prompt: string;
};

interface LayoutWithNavbarProps {
  suggestions?: Suggestion[];
  children: React.ReactNode;
}

const LayoutWithNavbar: React.FC<LayoutWithNavbarProps> = ({ suggestions = [], children }) => {
    
const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
<div className={styles.layout}>
<MainNavSidebar onToggle={setSidebarExpanded} />
<div className={styles.rightPanel}>
  <div className={styles.pageContent}>

  <div className={styles.container}>


  <div className={styles.stickyHeader}>
  <Navbar />
  {suggestions && <SuggestionsTopBar suggestions={suggestions} />}
</div>



<main className={styles.main}>{children}</main>

    </div>

  </div>
</div>
</div>
    
  );
};

export default LayoutWithNavbar;
