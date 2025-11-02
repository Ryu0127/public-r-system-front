import React, { ReactNode } from 'react';

interface ButtonIconInfoProps {
    iconWidth?: number;
    iconHeight?: number;
    addClass?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const ButtonIconInfo: React.FC<ButtonIconInfoProps> = ({
    iconWidth = 20,
    iconHeight = 20,
    addClass,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    return (
        <div className={`relative inline-block ${addClass}`}>
            <button
                className="flex items-center justify-center rounded-full p-1 bg-transparent hover:bg-gray-100 text-gray-500 transition-colors duration-200"
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                aria-label="情報"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={iconWidth}
                height={iconHeight}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" fill="white" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
        </div>
    );
};

export default ButtonIconInfo;