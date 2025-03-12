import React from 'react';
import styles from './InactiveButton.module.css';
import Icon from '../../Icons/Icon/index.tsx';

const InactiveButton = ({ text, icon }) => {
  return (
    <div className={styles.inactiveButton}>
      {icon && <Icon name={icon} variant={"secondary"}/>}
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default InactiveButton;
