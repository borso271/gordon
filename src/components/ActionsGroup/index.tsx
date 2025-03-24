import React from "react";
import styles from "./ActionsGroup.module.css";
import ActionButton from "../Buttons/ActionButton";

interface Action {
  iconName: string;
  text: string;
  onClick: () => void;
}

interface ActionsGroupProps {
  actions: Action[];
  disabled?: boolean;
}

const ActionsGroup: React.FC<ActionsGroupProps> = ({ actions, disabled = false }) => {
  return (
    <div className={styles.actionsGroup}>
      {actions.map(({ iconName, text, onClick }, index) => (
        <ActionButton
          key={index}
          iconName={iconName}
          text={text}
          onClick={onClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default ActionsGroup;
