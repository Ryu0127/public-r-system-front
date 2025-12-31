import React, { useState } from 'react';
import { ClothingItem } from '../../wardrobe/types';

interface DraggableItemSelectorProps {
  items: ClothingItem[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryLabels: Record<string, string> = {
  all: 'すべて',
  tops: 'トップス',
  bottoms: 'ボトムス',
  outerwear: 'アウター',
  shoes: 'シューズ',
  accessories: '小物',
};

export const DraggableItemSelector: React.FC<DraggableItemSelectorProps> = ({
  items,
  selectedCategory,
  onCategoryChange,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData('itemId', item.id);
    e.dataTransfer.setData('category', item.category);
    setDraggedItem(item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const categories = ['all', 'tops', 'bottoms', 'outerwear', 'shoes', 'accessories'];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        アイテムを選ぶ
      </h3>

      {/* カテゴリータブ */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* アイテムグリッド */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
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
            <p className="mt-4 text-gray-500 font-medium">
              このカテゴリーにアイテムがありません
            </p>
            <p className="mt-1 text-sm text-gray-400">
              ワードローブからアイテムを追加してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`cursor-grab active:cursor-grabbing transition-all transform hover:scale-105 ${
                  draggedItem === item.id ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border-2 border-transparent hover:border-indigo-300">
                  {/* 画像エリア */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="h-20 w-20 text-gray-300"
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
                    {/* ドラッグヒント */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                      <span className="text-white text-xs font-semibold flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        ドラッグして配置
                      </span>
                    </div>
                  </div>

                  {/* アイテム情報 */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    {item.brand && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {item.brand}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.category === 'tops'
                            ? 'bg-blue-100 text-blue-800'
                            : item.category === 'bottoms'
                            ? 'bg-green-100 text-green-800'
                            : item.category === 'outerwear'
                            ? 'bg-indigo-100 text-indigo-800'
                            : item.category === 'shoes'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* スクロールバーのスタイル */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};
