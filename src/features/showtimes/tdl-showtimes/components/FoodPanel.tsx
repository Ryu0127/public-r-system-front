import React, { useMemo } from 'react';
import { FoodCategoryFilter, FoodData } from '../types';
import FoodThumb from './FoodThumb';

interface FoodPanelProps {
  food: FoodData;
  categoryFilter: FoodCategoryFilter;
  onCategoryFilterChange: (category: FoodCategoryFilter) => void;
}

const CATEGORY_FILTERS: {
  value: FoodCategoryFilter;
  label: string;
}[] = [
  { value: 'all', label: 'すべて' },
  { value: 'summer', label: '🌊 夏イベント限定' },
  { value: 'std', label: '⭐ 定番' },
];

/**
 * フードメニュータブ
 */
const FoodPanel: React.FC<FoodPanelProps> = ({
  food,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return food.items;
    return food.items.filter((item) => item.category === categoryFilter);
  }, [food.items, categoryFilter]);

  return (
    <>
      <div className="food-filter" role="group" aria-label="カテゴリで絞り込み">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`fbtn${categoryFilter === filter.value ? ' active' : ''}`}
            onClick={() => onCategoryFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="status-box">このカテゴリのメニューはありません</div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className={`fcard f-${item.category}`}>
              <FoodThumb icon={item.icon} thumbUrl={item.thumbUrl || null} />
              <div className="fbody">
                <div className="fname">
                  {item.name}
                  {item.price ? (
                    <span className="fprice">{item.price}</span>
                  ) : null}
                </div>
                <div className="fbadges">
                  {item.category === 'summer' ? (
                    <span className="fbadge summer">🌊 夏イベント限定</span>
                  ) : (
                    <span className="fbadge std">⭐ 定番</span>
                  )}
                  {item.timeLimit ? (
                    <span className="fbadge time">⏰ {item.timeLimit}</span>
                  ) : null}
                </div>
                <div className="floc">
                  <span className="larea">{item.area}</span>
                  {item.shop}
                </div>
                <div className="fnote">{item.note}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="crowd-note">
        {food.notes.map((note, i) => (
          <React.Fragment key={note}>
            ※ {note}
            {i < food.notes.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default FoodPanel;
