import React from 'react';

interface CloudDividerProps {
  offwhite?: boolean;
}

export const CloudDivider: React.FC<CloudDividerProps> = ({ offwhite = false }) => {
  return (
    <div 
      className={offwhite ? "cloud-divider-offwhite" : "cloud-divider"} 
      aria-hidden="true"
    />
  );
};
export default CloudDivider;
