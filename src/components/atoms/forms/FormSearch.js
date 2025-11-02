import React from 'react';

const FormSearch = ({ addClass="", width="", text="", placeholder="" }) => {
  return (
    <div className="search-container" style={{ width: width }}>
        <input
          type="text"
          placeholder={ placeholder }
          className="search-input"
        />
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    </div>
  );
};

export default FormSearch;