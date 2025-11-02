import React from 'react';

const ButtonCyan = ({ addClass, text, onClick = () => {} }) => {
  return (
    <button
      type="button"
      className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm py-2.5 text-center ${addClass}`}
      onClick={onClick}
    >{text}</button>
  );
};

export default ButtonCyan;