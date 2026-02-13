import React from 'react';
import { DayMenu } from '../types';

interface DaySelectorProps {
  weekMenus: DayMenu[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const dayLabelsJa = ['日', '月', '火', '水', '木', '金', '土'];

const DaySelector: React.FC<DaySelectorProps> = ({
  weekMenus,
  selectedDayIndex,
  onSelectDay,
}) => {
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className="flex justify-center gap-1 md:gap-2">
      {weekMenus.map((dayMenu, index) => {
        const date = dayMenu.date;
        const dayOfWeek = date.getDay();
        const isSelected = index === selectedDayIndex;
        const today = isToday(date);

        return (
          <button
            key={index}
            onClick={() => onSelectDay(index)}
            className={`
              flex flex-col items-center px-2 md:px-3 py-2 transition-all duration-200 border
              ${isSelected
                ? 'border-amber-800/40 bg-amber-50/60 shadow-sm'
                : 'border-transparent hover:border-amber-800/15 hover:bg-amber-50/30'
              }
              ${today ? 'ring-1 ring-amber-600/30' : ''}
            `}
            style={{ fontFamily: "'Cormorant Garamond', serif", minWidth: '44px' }}
          >
            <span className="text-[10px] text-amber-800/50 tracking-wider uppercase">
              {dayLabels[dayOfWeek]}
            </span>
            <span
              className={`text-lg md:text-xl leading-tight ${
                isSelected ? 'text-amber-900' : 'text-amber-800/60'
              }`}
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: isSelected ? 700 : 400 }}
            >
              {date.getDate()}
            </span>
            <span className="text-[10px] text-amber-800/40">
              {dayLabelsJa[dayOfWeek]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
