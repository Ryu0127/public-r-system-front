import React from 'react';

interface WardrobeHeaderProps {
  onAddClick: () => void;
}

export const WardrobeHeader: React.FC<WardrobeHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">マイワードローブ</h1>
            <p className="mt-1 text-sm text-gray-500">
              洋服を管理して、コーディネートを楽しもう
            </p>
          </div>
          <button
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            アイテムを追加
          </button>
        </div>
      </div>
    </div>
  );
};
