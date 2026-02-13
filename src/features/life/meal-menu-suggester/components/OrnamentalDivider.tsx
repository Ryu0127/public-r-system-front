import React from 'react';

interface OrnamentalDividerProps {
  variant?: 'heavy' | 'light' | 'dots';
}

const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({ variant = 'light' }) => {
  if (variant === 'heavy') {
    return (
      <div className="flex items-center justify-center py-3 select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <span className="text-amber-800/40 text-lg tracking-widest">
          &#x2014;&#x2014;&#x2014;&nbsp;&nbsp;&#x273D;&nbsp;&nbsp;&#x2014;&#x2014;&#x2014;
        </span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center py-2 select-none">
        <span className="text-amber-800/30 text-xs tracking-[0.5em]">
          &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-2 select-none">
      <span className="text-amber-800/25 text-sm tracking-[0.3em]">
        ~ ~ ~ ~ ~ ~ ~
      </span>
    </div>
  );
};

export default OrnamentalDivider;
