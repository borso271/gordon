import React from "react";
import styles from "./SectionIcon.module.css"; // Adjust the path as needed
import Icon from "../Icon";

interface SectionIconProps {
  icon: string;
  tagColor?: string | null; // Optional or null allowed
  size?: number | null;
}
const SectionIcon: React.FC<SectionIconProps> = ({ icon, tagColor=null, size=null }) => {
  return (
    <div
    className={styles.tag}
    style={{
      ...(tagColor ? { backgroundColor: tagColor } : {})
     
    }}
  >
    <Icon name={icon} size={size}/>
  </div>
  );
};

export default SectionIcon;
