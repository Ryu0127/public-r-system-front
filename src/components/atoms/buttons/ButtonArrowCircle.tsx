import React, { ReactNode } from 'react';

interface ButtonArrowCircleProps {
    arrowType: string;
    hidden: boolean;
}

const ButtonArrowCircle: React.FC<ButtonArrowCircleProps> = ({ arrowType, hidden }) => {
    return (
        <button 
            className={`bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 transition-opacity duration-300 ${hidden ? 'opacity-100' : 'opacity-0'}`}
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {arrowType === 'left' && 
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          }
          {arrowType === 'right' && 
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          }
        </svg>
      </button>
    );
};

export default ButtonArrowCircle;