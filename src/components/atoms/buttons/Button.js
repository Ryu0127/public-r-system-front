import React from 'react';

const Button = ({ addClass, text, onClick = () => {} }) => {
  return (
    <button
      type="button"
      className={`font-medium rounded-lg text-sm py-2.5 text-center ${addClass}`}
      onClick={onClick}
    >{text}</button>
  );
};
  
export default Button;