'use client';

import React from 'react';
import styles from './LandingSuggestion.module.css';
import Icon from '../Icons/Icon';

type LandingSuggestionProps = {
  icon: string;
  label: string;
  prompt: string;
  onClick?: (prompt: string) => void; // ✅ New optional prop
};

const LandingSuggestion: React.FC<LandingSuggestionProps> = ({
  icon,
  label,
  prompt,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(prompt); // ✅ Use provided handler
    } else {
      console.log("📝 Prompt clicked:", prompt);
    }
  };

  return (
    <div className={styles.container}    onClick={handleClick}>
      <div className={styles.suggestionIcon}>
        <Icon name={icon} size={18} className={styles.icon} />
      </div>
      <div
        className={styles.suggestionLabel}
     
        data-prompt={prompt}
      >
        {label}
      </div>
    </div>
  );
};

export default LandingSuggestion;
