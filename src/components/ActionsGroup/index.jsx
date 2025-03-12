import React from "react";
import styles from "./ActionsGroup.module.css";
import ActionButton from "../Buttons/ActionButton";

const ActionsGroup = ({ actions, disabled}) => {
  return (
    <div className={styles.actionsGroup}>
      {actions.map(({ iconName, text, onClick }, index) => (
        <ActionButton key={index} iconName={iconName} text={text} onClick={onClick} disabled={disabled}/>
      ))}
    </div>
  );
};

export default ActionsGroup;
