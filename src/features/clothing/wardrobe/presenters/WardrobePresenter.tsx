import React from 'react';
import { WardrobeHeader } from '../components/WardrobeHeader';
import { WardrobeFilter } from '../components/WardrobeFilter';
import { WardrobeGrid } from '../components/WardrobeGrid';
import { ClothingItemModal } from '../components/ClothingItemModal';
import { ClothingItem, ClothingFormData, ClothingCategory, Season } from '../types';

interface WardrobePresenterProps {
  items: ClothingItem[];
  selectedItem: ClothingItem | null;
  isModalOpen: boolean;
  filterCategory: ClothingCategory | 'all';
  filterSeason: Season | 'all';
  onCategoryChange: (category: ClothingCategory | 'all') => void;
  onSeasonChange: (season: Season | 'all') => void;
  onAddClick: () => void;
  onItemClick: (item: ClothingItem) => void;
  onDeleteClick: (id: string) => void;
  onModalClose: () => void;
  onSave: (formData: ClothingFormData) => void;
}

export const WardrobePresenter: React.FC<WardrobePresenterProps> = ({
  items,
  selectedItem,
  isModalOpen,
  filterCategory,
  filterSeason,
  onCategoryChange,
  onSeasonChange,
  onAddClick,
  onItemClick,
  onDeleteClick,
  onModalClose,
  onSave,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WardrobeHeader onAddClick={onAddClick} />
      <WardrobeFilter
        filterCategory={filterCategory}
        filterSeason={filterSeason}
        onCategoryChange={onCategoryChange}
        onSeasonChange={onSeasonChange}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WardrobeGrid
          items={items}
          onItemClick={onItemClick}
          onDeleteClick={onDeleteClick}
        />
      </div>
      <ClothingItemModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={onModalClose}
        onSave={onSave}
      />
    </div>
  );
};
