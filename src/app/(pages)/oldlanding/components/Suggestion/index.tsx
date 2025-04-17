'use client';

import React from 'react';
import styles from './LandingSuggestion.module.css';
import Icon from '../../../../../components/Icons/Icon';
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
    <button
      className={styles.suggestionButton}
      onClick={handleClick}
      data-prompt={prompt}
    >
      <Icon name={icon} size={18} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default LandingSuggestion;
