import React from 'react';
import { DayMenu } from '../types';

interface DaySelectorProps {
  weekMenus: DayMenu[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

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
    <div className="flex justify-center gap-1">
      {weekMenus.map((dayMenu, index) => {
        const date = dayMenu.date;
        const dayOfWeek = date.getDay();
        const isSelected = index === selectedDayIndex;
        const today = isToday(date);
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;

        return (
          <button
            key={index}
            onClick={() => onSelectDay(index)}
            className={`
              flex flex-col items-center px-2.5 md:px-3.5 py-2 transition-all duration-200
              ${isSelected
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100'
              }
              ${today && !isSelected ? 'ring-1 ring-stone-400' : ''}
            `}
            style={{ fontFamily: "'Playfair Display', serif", minWidth: '44px' }}
          >
            <span className={`text-[10px] tracking-wider ${
              isSelected ? 'text-stone-300' :
              isSunday ? 'text-red-400' :
              isSaturday ? 'text-blue-400' : 'text-stone-400'
            }`}>
              {dayLabelsJa[dayOfWeek]}
            </span>
            <span
              className={`text-lg md:text-xl leading-tight ${
                isSelected ? 'text-white font-bold' : 'font-normal'
              }`}
            >
              {date.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
