import React from 'react';
import { ClothingItem } from '../../wardrobe/types';

interface TorsoProps {
  items: {
    tops?: ClothingItem;
    bottoms?: ClothingItem;
    outerwear?: ClothingItem;
    shoes?: ClothingItem;
    accessories?: ClothingItem[];
  };
  onDrop: (category: string, itemId: string) => void;
  onRemove: (category: string) => void;
}

export const Torso: React.FC<TorsoProps> = ({ items, onDrop, onRemove }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const itemCategory = e.dataTransfer.getData('category');

    if (itemCategory === category) {
      onDrop(category, itemId);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 shadow-xl">
      <div className="relative w-full max-w-md mx-auto">
        {/* トルソーの背景 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 200 400" className="w-full h-full">
            {/* シンプルなトルソーのシルエット */}
            <ellipse cx="100" cy="60" rx="40" ry="30" fill="currentColor" />
            <rect x="70" y="80" width="60" height="120" rx="10" fill="currentColor" />
            <path d="M 70 120 Q 40 140 40 180 L 40 250" stroke="currentColor" strokeWidth="20" fill="none" />
            <path d="M 130 120 Q 160 140 160 180 L 160 250" stroke="currentColor" strokeWidth="20" fill="none" />
            <rect x="80" y="200" width="20" height="180" rx="10" fill="currentColor" />
            <rect x="100" y="200" width="20" height="180" rx="10" fill="currentColor" />
          </svg>
        </div>

        {/* アイテム配置エリア */}
        <div className="relative space-y-4" style={{ minHeight: '600px' }}>
          {/* アウター */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'outerwear')}
            className="relative z-20"
          >
            {items.outerwear ? (
              <div className="relative group">
                <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-indigo-300 hover:border-indigo-500 transition-all">
                  {items.outerwear.imageUrl ? (
                    <img
                      src={items.outerwear.imageUrl}
                      alt={items.outerwear.name}
                      className="w-full h-48 object-contain"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 font-medium">
                        {items.outerwear.name}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {items.outerwear.name}
                    </p>
                    <p className="text-xs text-gray-500">アウター</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove('outerwear')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  アウターをドロップ
                </p>
              </div>
            )}
          </div>

          {/* トップス */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'tops')}
            className="relative z-10"
          >
            {items.tops ? (
              <div className="relative group">
                <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-300 hover:border-blue-500 transition-all">
                  {items.tops.imageUrl ? (
                    <img
                      src={items.tops.imageUrl}
                      alt={items.tops.name}
                      className="w-full h-40 object-contain"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-medium">
                        {items.tops.name}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {items.tops.name}
                    </p>
                    <p className="text-xs text-gray-500">トップス</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove('tops')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  トップスをドロップ
                </p>
              </div>
            )}
          </div>

          {/* ボトムス */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'bottoms')}
            className="relative z-10"
          >
            {items.bottoms ? (
              <div className="relative group">
                <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-300 hover:border-green-500 transition-all">
                  {items.bottoms.imageUrl ? (
                    <img
                      src={items.bottoms.imageUrl}
                      alt={items.bottoms.name}
                      className="w-full h-40 object-contain"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 font-medium">
                        {items.bottoms.name}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {items.bottoms.name}
                    </p>
                    <p className="text-xs text-gray-500">ボトムス</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove('bottoms')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  ボトムスをドロップ
                </p>
              </div>
            )}
          </div>

          {/* シューズ */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'shoes')}
            className="relative z-10"
          >
            {items.shoes ? (
              <div className="relative group">
                <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-300 hover:border-purple-500 transition-all">
                  {items.shoes.imageUrl ? (
                    <img
                      src={items.shoes.imageUrl}
                      alt={items.shoes.name}
                      className="w-full h-32 object-contain"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 font-medium">
                        {items.shoes.name}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {items.shoes.name}
                    </p>
                    <p className="text-xs text-gray-500">シューズ</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove('shoes')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  シューズをドロップ
                </p>
              </div>
            )}
          </div>

          {/* 小物エリア */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'accessories')}
            className="relative z-10"
          >
            {items.accessories && items.accessories.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-yellow-300">
                <p className="text-sm font-semibold text-gray-700 mb-3">小物</p>
                <div className="grid grid-cols-3 gap-2">
                  {items.accessories.map((accessory, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-2">
                        {accessory.imageUrl ? (
                          <img
                            src={accessory.imageUrl}
                            alt={accessory.name}
                            className="w-full h-16 object-contain"
                          />
                        ) : (
                          <div className="w-full h-16 flex items-center justify-center">
                            <span className="text-xs text-yellow-600">
                              {accessory.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove('accessories')}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-yellow-400 hover:bg-yellow-50 transition-all">
                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  小物をドロップ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
