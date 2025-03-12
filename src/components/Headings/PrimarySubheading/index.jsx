import React from 'react';
import styles from './PrimarySubheading.module.css';

const PrimarySubheading = ({ children }) => {
  return <h2 className={styles.subheading}>{children}</h2>;
};

export default PrimarySubheading;
