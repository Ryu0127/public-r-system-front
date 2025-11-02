import React from 'react';
import './Overlay.css'; // スタイルを追加

const Overlay = ({ visible, addCss="", onClick }) => {
  return (
    visible && <div className={`overlay ${addCss}`} onClick={onClick}></div>
  );
};

export default Overlay;