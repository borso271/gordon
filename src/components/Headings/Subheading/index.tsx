import React, { ReactNode } from 'react';
import styles from './Subheading.module.css';

interface SubheadingProps {
  children: ReactNode;
}

export const Subheading: React.FC<SubheadingProps> = ({ children }) => {
  return <h2 className={styles.subheading}>{children}</h2>;
};
