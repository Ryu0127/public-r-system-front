import React from 'react';
import { MenuItem, MealTime } from '../types';

interface MenuCardProps {
  menuItem: MenuItem;
  mealTime: MealTime;
  itemIndex: number;
  onShuffle: (mealTime: MealTime, itemIndex: number) => void;
}

const plateColors: Record<MealTime, string[]> = {
  colazione: [
    'from-amber-100 to-orange-50',
    'from-yellow-50 to-amber-100',
    'from-orange-50 to-yellow-50',
    'from-amber-50 to-orange-100',
    'from-yellow-100 to-amber-50',
    'from-orange-100 to-amber-50',
  ],
  pranzo: [
    'from-emerald-50 to-teal-50',
    'from-lime-50 to-green-50',
    'from-teal-50 to-cyan-50',
    'from-green-50 to-emerald-50',
    'from-cyan-50 to-teal-50',
    'from-emerald-100 to-green-50',
  ],
  cena: [
    'from-rose-50 to-pink-50',
    'from-red-50 to-orange-50',
    'from-pink-50 to-rose-50',
    'from-orange-50 to-red-50',
    'from-rose-100 to-pink-50',
    'from-pink-100 to-rose-50',
  ],
};

const MenuCard: React.FC<MenuCardProps> = ({
  menuItem,
  mealTime,
  itemIndex,
  onShuffle,
}) => {
  const gradient = plateColors[mealTime][itemIndex % plateColors[mealTime].length];

  return (
    <div
      className="group cursor-pointer transition-all duration-200 hover:opacity-80"
      onClick={() => onShuffle(mealTime, itemIndex)}
    >
      {/* Image placeholder */}
      <div
        className={`w-full aspect-square bg-gradient-to-br ${gradient} rounded-sm flex items-center justify-center overflow-hidden relative`}
      >
        <span
          className="text-stone-400/60 text-[10px] tracking-widest uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {menuItem.nameEn}
        </span>
        {/* Shuffle icon on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-stone-500/0 group-hover:text-stone-500/50 transition-all duration-200 text-lg">
            refresh
          </span>
        </div>
      </div>

      {/* Dish name */}
      <h4
        className="mt-2 text-sm md:text-base text-stone-800 leading-snug font-semibold"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {menuItem.name}
      </h4>

      {/* Description */}
      <p className="mt-0.5 text-[11px] md:text-xs text-stone-400 leading-relaxed">
        {menuItem.description}
      </p>
    </div>
  );
};

export default MenuCard;
