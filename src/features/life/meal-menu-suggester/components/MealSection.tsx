import React from 'react';
import { MenuItem, MealTime, MealTimeConfig } from '../types';
import CornerFrame from './CornerFrame';
import MenuCard from './MenuCard';

interface MealSectionProps {
  config: MealTimeConfig;
  items: MenuItem[];
  isShuffling: boolean;
  onShuffleItem: (mealTime: MealTime, itemIndex: number) => void;
  onShuffleSection: (mealTime: MealTime) => void;
}

const MealSection: React.FC<MealSectionProps> = ({
  config,
  items,
  isShuffling,
  onShuffleItem,
  onShuffleSection,
}) => {
  return (
    <div className="bg-white">
      <CornerFrame>
        {/* Section header */}
        <div className="text-center mb-6">
          <p
            className="text-stone-800 tracking-[0.3em] text-base md:text-lg"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            {config.labelJa}
          </p>
          <h2
            className="text-3xl md:text-4xl text-stone-800 tracking-wider mt-1"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            MENU
          </h2>
          <p
            className="text-stone-400 text-xs tracking-[0.2em] mt-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {config.time}
          </p>
        </div>

        {/* Thin divider */}
        <div className="w-12 h-px bg-stone-300 mx-auto mb-6" />

        {/* 3x2 Grid */}
        <div
          className={`grid grid-cols-3 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-6 transition-all duration-300 ${
            isShuffling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {items.map((item, index) => (
            <MenuCard
              key={`${item.id}-${index}`}
              menuItem={item}
              mealTime={config.key}
              itemIndex={index}
              onShuffle={onShuffleItem}
            />
          ))}
        </div>

        {/* Section footer bar */}
        <div className="mt-6">
          <button
            onClick={() => onShuffleSection(config.key)}
            className="w-full py-2.5 bg-stone-800 text-white text-xs tracking-[0.25em] uppercase transition-all duration-200 hover:bg-stone-700"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
          >
            {config.labelJa} Time {config.time}
            <span className="material-symbols-outlined text-sm ml-2 align-middle">refresh</span>
          </button>
        </div>
      </CornerFrame>
    </div>
  );
};

export default MealSection;
