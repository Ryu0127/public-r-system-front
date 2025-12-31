import React, { useState } from 'react';
import { CoordinateHeader } from '../components/CoordinateHeader';
import { CoordinateForm } from '../components/CoordinateForm';
import { Torso } from '../components/Torso';
import { DraggableItemSelector } from '../components/DraggableItemSelector';
import { ClothingItem } from '../../wardrobe/types';
import { Link } from 'react-router-dom';

interface CoordinatePresenterProps {
  formData: {
    name: string;
    description: string;
    occasion: string;
    season: string;
  };
  selectedItems: {
    tops?: string;
    bottoms?: string;
    outerwear?: string;
    shoes?: string;
    accessories: string[];
  };
  onFormChange: (data: any) => void;
  onSelectItem: (category: string, itemId: string) => void;
  getItemsByCategory: (category: string) => ClothingItem[];
  allItems: ClothingItem[];
  onSave: () => void;
}

export const CoordinatePresenter: React.FC<CoordinatePresenterProps> = ({
  formData,
  selectedItems,
  onFormChange,
  onSelectItem,
  getItemsByCategory,
  allItems,
  onSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getSelectedItemObjects = () => {
    return {
      tops: selectedItems.tops
        ? allItems.find((item) => item.id === selectedItems.tops)
        : undefined,
      bottoms: selectedItems.bottoms
        ? allItems.find((item) => item.id === selectedItems.bottoms)
        : undefined,
      outerwear: selectedItems.outerwear
        ? allItems.find((item) => item.id === selectedItems.outerwear)
        : undefined,
      shoes: selectedItems.shoes
        ? allItems.find((item) => item.id === selectedItems.shoes)
        : undefined,
      accessories: selectedItems.accessories
        .map((id) => allItems.find((item) => item.id === id))
        .filter((item): item is ClothingItem => item !== undefined),
    };
  };

  const handleRemoveItem = (category: string) => {
    if (category === 'accessories') {
      onSelectItem(category, ''); // Clear all accessories
    } else {
      onSelectItem(category, '');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <CoordinateHeader onSave={onSave} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/clothing/wardrobe"
            className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm text-sm text-indigo-600 hover:text-indigo-700 hover:shadow-md transition-all"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ワードローブに戻る
          </Link>
        </div>

        {/* コーディネート情報フォーム */}
        <div className="mb-8">
          <CoordinateForm formData={formData} onChange={onFormChange} />
        </div>

        {/* メインコンテンツ：トルソーとアイテムセレクター */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：トルソー */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg
                    className="w-7 h-7 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  コーディネート
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  アイテムをドラッグして配置しよう
                </p>
              </div>
              <Torso
                items={getSelectedItemObjects()}
                onDrop={onSelectItem}
                onRemove={handleRemoveItem}
              />
            </div>
          </div>

          {/* 右側：アイテムセレクター */}
          <div className="order-1 lg:order-2">
            <DraggableItemSelector
              items={allItems}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-indigo-900">
                使い方のヒント
              </h3>
              <div className="mt-2 text-sm text-indigo-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>右側のアイテムをドラッグして、左側のトルソーにドロップ</li>
                  <li>カテゴリータブで表示するアイテムを絞り込めます</li>
                  <li>配置したアイテムにカーソルを合わせると削除ボタンが表示されます</li>
                  <li>完成したら上部の「保存」ボタンでコーディネートを保存</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
