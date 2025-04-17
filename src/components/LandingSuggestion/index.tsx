'use client';

import React from 'react';
import styles from './LandingSuggestion.module.css';
import Icon from '../Icons/Icon';
type LandingSuggestionProps = {
  icon: string;
  label: string;
  prompt: string;
};

const LandingSuggestion: React.FC<LandingSuggestionProps> = ({ icon, label, prompt }) => {
  const handleClick = () => {
    console.log("📝 Prompt clicked:", prompt);
  };

  return (
    <div className={styles.container}>
      <div className={styles.suggestionIcon}>
      <Icon name={icon} size={18} className={styles.icon} />
      </div>
    <div
      className={styles.suggestionLabel}
      onClick={handleClick}
      data-prompt={prompt}
    >
     
     {label}
    </div>
    </div>

  );
};

export default LandingSuggestion;
