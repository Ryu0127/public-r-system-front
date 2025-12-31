import React from 'react';
import { ClothingCategory, Season } from '../types';

interface WardrobeFilterProps {
  filterCategory: ClothingCategory | 'all';
  filterSeason: Season | 'all';
  onCategoryChange: (category: ClothingCategory | 'all') => void;
  onSeasonChange: (season: Season | 'all') => void;
}

const categoryLabels: Record<ClothingCategory | 'all', string> = {
  all: 'すべて',
  tops: 'トップス',
  bottoms: 'ボトムス',
  outerwear: 'アウター',
  shoes: 'シューズ',
  accessories: '小物',
};

const seasonLabels: Record<Season | 'all', string> = {
  all: 'すべて',
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const WardrobeFilter: React.FC<WardrobeFilterProps> = ({
  filterCategory,
  filterSeason,
  onCategoryChange,
  onSeasonChange,
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryLabels) as (ClothingCategory | 'all')[]).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filterCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              シーズン
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(seasonLabels) as (Season | 'all')[]).map((season) => (
                <button
                  key={season}
                  onClick={() => onSeasonChange(season)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterSeason === season
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {seasonLabels[season]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
