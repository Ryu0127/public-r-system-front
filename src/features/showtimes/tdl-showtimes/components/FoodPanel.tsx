import React, { useMemo } from 'react';
import { FoodAreaFilter, FoodData, FoodItem } from '../types';
import { listAvailableAreas } from '../hooks/showtimesUtils';
import { FAVORITE_TYPE } from '../constants/favoriteType';
import FoodThumb from './FoodThumb';
import FavoriteButton from './FavoriteButton';

interface FoodPanelProps {
  food: FoodData;
  areaFilter: FoodAreaFilter;
  favoriteFoodMenuIds: Record<string, true>;
  favoritePendingIds: Record<string, true>;
  onAreaFilterChange: (area: FoodAreaFilter) => void;
  onToggleFavorite: (foodMenuId: string) => void;
}

const ExtLinkIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/** YYYY-MM-DD（または datetime 文字列）→ M/D */
const formatPeriodDate = (date: string): string | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date.trim());
  if (!match) return null;
  return `${Number(match[2])}/${Number(match[3])}`;
};

const formatLimitedPeriod = (item: FoodItem): string | null => {
  if (item.category !== 'limited') return null;

  const start = item.publishStartDate
    ? formatPeriodDate(item.publishStartDate)
    : null;
  const end = item.publishEndDate
    ? formatPeriodDate(item.publishEndDate)
    : null;

  if (start && end) return `${start}〜${end}`;
  if (start) return `${start}〜`;
  if (end) return `〜${end}`;
  return null;
};

/**
 * フードメニュータブ
 */
const FoodPanel: React.FC<FoodPanelProps> = ({
  food,
  areaFilter,
  favoriteFoodMenuIds,
  favoritePendingIds,
  onAreaFilterChange,
  onToggleFavorite,
}) => {
  const areas = useMemo(
    () => listAvailableAreas(food.items),
    [food.items]
  );

  const filtered = useMemo(() => {
    const items =
      areaFilter === 'all'
        ? food.items
        : food.items.filter((item) => item.area === areaFilter);
    return [...items].sort((a, b) => {
      const aFav = favoriteFoodMenuIds[a.id] ? 0 : 1;
      const bFav = favoriteFoodMenuIds[b.id] ? 0 : 1;
      return aFav - bFav;
    });
  }, [food.items, areaFilter, favoriteFoodMenuIds]);

  return (
    <>
      <div className="areabar mt-4" role="group" aria-label="エリアで絞り込み">
        <button
          type="button"
          className={`abtn${areaFilter === 'all' ? ' active' : ''}`}
          onClick={() => onAreaFilterChange('all')}
        >
          すべて
        </button>
        {areas.map((area) => (
          <button
            key={area}
            type="button"
            className={`abtn${areaFilter === area ? ' active' : ''}`}
            onClick={() => onAreaFilterChange(area)}
          >
            {area}
          </button>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="status-box">この条件のメニューはありません</div>
        ) : (
          filtered.map((item) => {
            const limitedPeriod = formatLimitedPeriod(item);
            const isFavorite = Boolean(favoriteFoodMenuIds[item.id]);
            const pending = Boolean(
              favoritePendingIds[`${FAVORITE_TYPE.FOOD_MENU}:${item.id}`]
            );

            return (
              <div
                key={item.id}
                className={`fcard f-${item.category}${isFavorite ? ' is-fav' : ''}`}
              >
                <FoodThumb icon={item.icon} thumbUrl={item.thumbUrl || null} />
                <div className="fbody">
                  <div className="fname-row">
                    <div className="fname">
                      {item.name}
                      {item.price ? (
                        <span className="fprice">{item.price}</span>
                      ) : null}
                    </div>
                    <FavoriteButton
                      isFavorite={isFavorite}
                      label={item.name}
                      disabled={pending}
                      onToggle={() => onToggleFavorite(item.id)}
                    />
                  </div>
                  <div className="fbadges">
                    {item.category === 'limited' ? (
                      <span className="fbadge limited">期間限定</span>
                    ) : (
                      <span className="fbadge std">⭐ 定番</span>
                    )}
                    {limitedPeriod ? (
                      <span className="fbadge period">📅 {limitedPeriod}</span>
                    ) : null}
                    {item.timeLimit ? (
                      <span className="fbadge time">⏰ {item.timeLimit}</span>
                    ) : null}
                  </div>
                  <div className="floc">
                    <span className="larea">{item.area}</span>
                    {item.shop}
                  </div>
                  {item.contents.length > 0 ? (
                    <div className="fcontents">
                      {item.contents.join(' ／ ')}
                    </div>
                  ) : null}
                  {item.officialUrl ? (
                    <div className="official-link food-official-link">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        公式サイトで見る
                        <ExtLinkIcon />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
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
