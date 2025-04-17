
import React, { ReactNode } from "react";
import styles from "./SectionHeader.module.css"; // Adjust the path as needed
import SectionIcon from "../../Icons/SectionIcon";
import SecondaryH2 from "../SecondaryH2";


interface SectionHeaderProps {
  title: ReactNode; // was string
  icon?: string;
  size?: number;
  tagColor?: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, tagColor=null, size=null }) => {
  return (
    <header className={styles.header}>
      <SectionIcon icon={icon} tagColor={tagColor} size={size} />
      <SecondaryH2>{title}</SecondaryH2>
    </header>
  );
};

export default SectionHeader;
