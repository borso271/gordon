import React from 'react';
import styles from './Subheading.module.css';

export const Subheading = ({ children }) => {
  return <h2 className={styles.subheading}>{children}</h2>;
};
