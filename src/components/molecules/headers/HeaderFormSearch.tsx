import React from 'react';

interface FormSearchProps {
  justifyClass?: string;
  width?: string;
  addClass?: string;
  placeholder?: string;
  value?: string;
}

const HeaderFormSearch: React.FC<FormSearchProps> = ({ 
  justifyClass = "justify-center",
  width = "",
  addClass = "",
  placeholder,
  value,
}) => {
  return (
    <div className={`d-flex ${justifyClass}`}>
        <div className={`search-container ${addClass}`} style={{ width }}>
          <input
            type="text"
            placeholder={placeholder}
            className="search-input"
            defaultValue={value}
          />
          <svg 
            className="search-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
    </div>
  );
};

export default HeaderFormSearch;