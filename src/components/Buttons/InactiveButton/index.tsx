import React from 'react';
import styles from './InactiveButton.module.css';
import Icon from '../../Icons/Icon';

interface InactiveButtonProps {
  text: string;
  icon?: string | null;
}

const InactiveButton: React.FC<InactiveButtonProps> = ({ text, icon }) => {
  return (
    <div className={styles.inactiveButton}>
      {icon && <Icon name={icon} variant="secondary" />}
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default InactiveButton;
