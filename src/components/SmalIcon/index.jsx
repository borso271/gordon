import React from "react";

const SmallIcon = ({ path, className = "" }) => {
  return (
    <div className={className}>
    <img 
      className="icon"
      src={path}
      alt="icon"
      
      style={{ objectFit: "contain", width:"100%" }}
    /></div>
  );
};

export default SmallIcon;
