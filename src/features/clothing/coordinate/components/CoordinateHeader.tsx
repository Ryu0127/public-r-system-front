import React from 'react';
import { Link } from 'react-router-dom';

interface CoordinateHeaderProps {
  onSave: () => void;
}

export const CoordinateHeader: React.FC<CoordinateHeaderProps> = ({ onSave }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">コーディネート作成</h1>
            <p className="mt-1 text-sm text-gray-500">
              洋服を選んでコーディネートを作りましょう
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/clothing/coordinate-list"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              コーディネート一覧
            </Link>
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
