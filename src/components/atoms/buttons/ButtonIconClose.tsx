import React from 'react';

interface ButtonIconCloseProps {
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const ButtonIconClose: React.FC<ButtonIconCloseProps> = ({
    size = 'medium',
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-10 h-10'
      };
      const strokeWidth = size === 'small' ? 1.5 : 2;
    return (
        <div className="relative inline-block">
            <button 
                className={`flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200 ${sizeClasses[size]}`}
                onClick={onClick} 
                onMouseEnter={onMouseEnter} 
                onMouseLeave={onMouseLeave}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full p-1"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
};

export default ButtonIconClose;