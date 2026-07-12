import React from 'react';

interface StickyActionBarProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * 画面下部固定のアクションバー（Xブルーのメインボタン）
 */
const StickyActionBar: React.FC<StickyActionBarProps> = ({
  label,
  disabled = false,
  onClick,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
            !disabled
              ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {label}
        </button>
      </div>
    </div>
  </div>
);

export default StickyActionBar;
