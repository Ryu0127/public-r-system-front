import React from 'react';
import { MenuItem, MealTime, MealTimeConfig } from '../types';
import OrnamentalDivider from './OrnamentalDivider';

interface MenuCardProps {
  mealTimeConfig: MealTimeConfig;
  menuItem: MenuItem;
  isShuffling: boolean;
  onShuffle: (mealTime: MealTime) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  mealTimeConfig,
  menuItem,
  isShuffling,
  onShuffle,
}) => {
  return (
    <div className="group relative">
      {/* Meal time header */}
      <div className="text-center mb-3">
        <h3
          className="text-xl md:text-2xl tracking-wider text-amber-900/80 mb-0"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
        >
          {mealTimeConfig.labelIt}
        </h3>
        <span
          className="text-xs text-amber-800/50 tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {mealTimeConfig.labelJa}
        </span>
      </div>

      <OrnamentalDivider variant="dots" />

      {/* Menu item */}
      <div
        className={`text-center py-3 transition-all duration-300 ${
          isShuffling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <p
          className="text-lg md:text-xl text-amber-950 mb-1 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.3rem' }}
        >
          {menuItem.name}
        </p>
        <p
          className="text-sm text-amber-800/50 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {menuItem.description}
        </p>
      </div>

      {/* Shuffle button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => onShuffle(mealTimeConfig.key)}
          className="px-4 py-1.5 text-xs tracking-widest text-amber-800/60 hover:text-amber-900 border border-amber-800/20 hover:border-amber-800/40 rounded-none transition-all duration-200 hover:bg-amber-50/50 uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '0.15em' }}
        >
          Cambiare
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
