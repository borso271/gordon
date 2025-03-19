import React from 'react';
import styles from './PrimaryButton.module.css';
import Icon from '../../Icons/Icon/index.tsx';

const PrimaryButton = ({ text, icon }) => {

  return (
    <button className={styles.primaryButton}>
      <span className={styles.text}>{text}</span>
      {icon &&  <Icon name={icon} variant={"primary"}/>}
    </button>
  );
};

export default PrimaryButton;
