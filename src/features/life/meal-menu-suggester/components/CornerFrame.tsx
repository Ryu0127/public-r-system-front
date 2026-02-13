import React from 'react';

interface CornerFrameProps {
  children: React.ReactNode;
}

const CornerFrame: React.FC<CornerFrameProps> = ({ children }) => {
  const cornerStyle = 'absolute w-8 h-8 md:w-10 md:h-10';
  const borderColor = 'border-stone-400';

  return (
    <div className="relative px-5 py-6 md:px-8 md:py-8">
      {/* Top-left corner */}
      <div className={`${cornerStyle} top-0 left-0 border-t-2 border-l-2 ${borderColor}`} />
      {/* Top-right corner */}
      <div className={`${cornerStyle} top-0 right-0 border-t-2 border-r-2 ${borderColor}`} />
      {/* Bottom-left corner */}
      <div className={`${cornerStyle} bottom-0 left-0 border-b-2 border-l-2 ${borderColor}`} />
      {/* Bottom-right corner */}
      <div className={`${cornerStyle} bottom-0 right-0 border-b-2 border-r-2 ${borderColor}`} />
      {children}
    </div>
  );
};

export default CornerFrame;
