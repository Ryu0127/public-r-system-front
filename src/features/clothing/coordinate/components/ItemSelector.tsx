import React from 'react';
import { ClothingItem } from '../../wardrobe/types';

interface ItemSelectorProps {
  category: string;
  categoryLabel: string;
  items: ClothingItem[];
  selectedItems: string[];
  onSelect: (itemId: string) => void;
  multiSelect?: boolean;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
  category,
  categoryLabel,
  items,
  selectedItems,
  onSelect,
  multiSelect = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {categoryLabel}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          このカテゴリーのアイテムがまだありません
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
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
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  {item.brand && (
                    <p className="text-xs text-gray-500 truncate">{item.brand}</p>
                  )}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
