import React from 'react';
import { ClothingItem } from '../types';

interface WardrobeGridProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
  onDeleteClick: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  tops: 'トップス',
  bottoms: 'ボトムス',
  outerwear: 'アウター',
  shoes: 'シューズ',
  accessories: '小物',
};

const colorLabels: Record<string, string> = {
  black: '黒',
  white: '白',
  gray: 'グレー',
  navy: 'ネイビー',
  blue: '青',
  brown: '茶',
  beige: 'ベージュ',
  green: '緑',
  red: '赤',
  other: 'その他',
};

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  onItemClick,
  onDeleteClick,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">アイテムがありません</h3>
        <p className="mt-1 text-sm text-gray-500">
          アイテムを追加してワードローブを充実させましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div
            onClick={() => onItemClick(item)}
            className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                <svg
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {categoryLabels[item.category]}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {colorLabels[item.color]}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(item.id);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            {item.brand && (
              <p className="mt-2 text-xs text-gray-500">{item.brand}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
