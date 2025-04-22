import React from 'react';

interface ButtonBarChildren {
  children: any; 
}

// Dynamically grows a container for buttons based on how many are inserted into it
const ButtonBar: React.FC<ButtonBarChildren> = ({ children }) => {
  return (
    <div className={`button-group`}>
      {children}
    </div>
  );
};

export default ButtonBar;
