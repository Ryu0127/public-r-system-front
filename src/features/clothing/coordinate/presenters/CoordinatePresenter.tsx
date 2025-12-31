import React from 'react';
import { CoordinateHeader } from '../components/CoordinateHeader';
import { CoordinateForm } from '../components/CoordinateForm';
import { ItemSelector } from '../components/ItemSelector';
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
  onSave: () => void;
}

export const CoordinatePresenter: React.FC<CoordinatePresenterProps> = ({
  formData,
  selectedItems,
  onFormChange,
  onSelectItem,
  getItemsByCategory,
  onSave,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinateHeader onSave={onSave} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/clothing/wardrobe"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
          >
            <svg
              className="mr-1 h-4 w-4"
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

        <div className="space-y-6">
          <CoordinateForm formData={formData} onChange={onFormChange} />

          <ItemSelector
            category="tops"
            categoryLabel="トップス"
            items={getItemsByCategory('tops')}
            selectedItems={selectedItems.tops ? [selectedItems.tops] : []}
            onSelect={(itemId) => onSelectItem('tops', itemId)}
          />

          <ItemSelector
            category="bottoms"
            categoryLabel="ボトムス"
            items={getItemsByCategory('bottoms')}
            selectedItems={selectedItems.bottoms ? [selectedItems.bottoms] : []}
            onSelect={(itemId) => onSelectItem('bottoms', itemId)}
          />

          <ItemSelector
            category="outerwear"
            categoryLabel="アウター"
            items={getItemsByCategory('outerwear')}
            selectedItems={selectedItems.outerwear ? [selectedItems.outerwear] : []}
            onSelect={(itemId) => onSelectItem('outerwear', itemId)}
          />

          <ItemSelector
            category="shoes"
            categoryLabel="シューズ"
            items={getItemsByCategory('shoes')}
            selectedItems={selectedItems.shoes ? [selectedItems.shoes] : []}
            onSelect={(itemId) => onSelectItem('shoes', itemId)}
          />

          <ItemSelector
            category="accessories"
            categoryLabel="小物"
            items={getItemsByCategory('accessories')}
            selectedItems={selectedItems.accessories}
            onSelect={(itemId) => onSelectItem('accessories', itemId)}
            multiSelect
          />
        </div>
      </div>
    </div>
  );
};
