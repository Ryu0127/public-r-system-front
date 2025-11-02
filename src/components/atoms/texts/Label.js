import React from 'react';

const Label = ({ addClass="", children }) => {
  return (
    <label className={`text-gray-900 ${addClass}`}>{children}</label>
  );
};
  
export default Label;