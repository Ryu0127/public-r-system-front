import React from 'react';

export interface SelectItemRedirectOption {
  label: string;
  value: string;
  redirectUrl: string;
}

export interface SelectItemRedirectProps {
  options: SelectItemRedirectOption[];
  buttonLabel: string;
  width: string;
  maxHeight: number;
  isOpen: boolean;
  activeItem: string | null;
  selectedItem: string | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onToggleDropdown: () => void;
  onMouseEnter: (optionId: string) => void;
  onMouseLeave: () => void;
}

/**
 * ドロップダウン選択コンポーネント
 * UI表示のみを担当するコンポーネント
 */
const SelectItemRedirect: React.FC<SelectItemRedirectProps> = ({
  options,
  buttonLabel = '並び替え',
  width = 'auto',
  maxHeight = 150,
  isOpen,
  activeItem,
  selectedItem,
  dropdownRef,
  onToggleDropdown,
  onMouseEnter,
  onMouseLeave,
}) => {
  const selectedOptionLabel = selectedItem ? options.find((option: SelectItemRedirectOption) => option.value === selectedItem)?.label : null;

  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left" ref={dropdownRef} style={{ width }}>
        <button 
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground bg-white h-9 rounded-md px-3"
          style={{ width }}
          onClick={onToggleDropdown}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
            />
          </svg>
          <span className="text-sm font-medium">{buttonLabel}</span>
          {selectedOptionLabel && (
            <span className="text-xs text-gray-500 ml-1 truncate">
              ({selectedOptionLabel})
            </span>
          )}
        </button>
        
        <div 
          className={`absolute right-0 mt-1 w-full bg-white rounded shadow-lg border border-gray-200 z-10 overflow-hidden transition-all duration-300 ease-in-out`}
          style={{ maxHeight: isOpen ? `${maxHeight}px` : '0px', opacity: isOpen ? 1 : 0 }}
        >
          <ul className="py-1 pl-0 overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
            {options.map((option) => (
              <li 
                key={option.value}
                className={`cursor-pointer px-4 py-2 text-sm text-gray-700 transition-colors duration-150 ${activeItem === option.value || selectedItem === option.value ? 'bg-gray-300' : ''}`}
                onMouseEnter={() => onMouseEnter(option.value)}
                onMouseLeave={onMouseLeave}
              >
                <a href={option.redirectUrl}>
                  <span className="text-sm font-medium text-gray-500 ml-1 truncate">
                    {option.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectItemRedirect;