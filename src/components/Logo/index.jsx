

import React from "react";
import styles from "./MainLogo.module.css"
const MainLogo = ({
  
  onClick,
}) => {
 

  return (
    <div onClick={onClick} className={styles.sd}>
      <img src="/g5.svg"></img>
    </div>
  );
};

export default MainLogo;