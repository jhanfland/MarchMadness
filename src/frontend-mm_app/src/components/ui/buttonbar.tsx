import React from 'react';

interface ButtonBarChildren {
  children: any; 
}

const ButtonBar: React.FC<ButtonBarChildren> = ({ children }) => {
  return (
    <div className={`button-group`}>
      {children}
    </div>
  );
};

export default ButtonBar;
