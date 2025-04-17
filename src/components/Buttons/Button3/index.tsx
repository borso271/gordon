import React from 'react';
import styles from './Button3.module.css';
import Icon from '../../Icons/Icon';

interface Button3Props {
  text: string;
  icon?: string | null;
  onClick?: () => void;
  disabled?: boolean;
}

const Button3: React.FC<Button3Props> = ({ text, icon, onClick, disabled = false }) => {
  return (
    <button
      className={styles.primaryButton}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.text}>{text}</span>
      {icon && <Icon name={icon} variant="primary" />}
    </button>
  );
};

export default Button3;
