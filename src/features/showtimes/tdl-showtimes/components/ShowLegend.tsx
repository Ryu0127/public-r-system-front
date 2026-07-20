import React from 'react';
import { ShowItem } from '../types';
import { FAVORITE_TYPE } from '../constants/favoriteType';
import FavoriteButton from './FavoriteButton';

interface ShowLegendProps {
  shows: ShowItem[];
  enabledShows: Record<string, boolean>;
  favoriteShowParadeIds: Record<string, true>;
  favoritePendingIds: Record<string, true>;
  onToggle: (showId: string) => void;
  onToggleFavorite: (showId: string) => void;
  officialUrl: string;
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

/**
 * ショー一覧（表示トグル付き）
 */
const ShowLegend: React.FC<ShowLegendProps> = ({
  shows,
  enabledShows,
  favoriteShowParadeIds,
  favoritePendingIds,
  onToggle,
  onToggleFavorite,
  officialUrl,
}) => {
  const sortedShows = [...shows].sort((a, b) => {
    const aFav = favoriteShowParadeIds[a.id] ? 0 : 1;
    const bFav = favoriteShowParadeIds[b.id] ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <>
      <div className="official-link">
        <a href={officialUrl} target="_blank" rel="noopener noreferrer">
          各ショーの詳細は公式サイトで確認
          <ExtLinkIcon />
        </a>
      </div>

      <section className="legend" aria-label="この日に公演があるショー一覧">
        {sortedShows.map((show) => {
          const on = enabledShows[show.id] !== false;
          const isFavorite = Boolean(favoriteShowParadeIds[show.id]);
          const pending = Boolean(
            favoritePendingIds[`${FAVORITE_TYPE.SHOW_PARADE}:${show.id}`]
          );
          const subParts = [
            show.location,
            show.duration,
            show.frequency,
          ].filter(Boolean);

          return (
            <div
              key={show.id}
              className={`legend-card${on ? '' : ' is-off'}${isFavorite ? ' is-fav' : ''}`}
              style={{ ['--dot' as string]: show.color }}
            >
              <div className="thumb-wrap" aria-hidden="true">
                {show.thumbUrl ? (
                  <img
                    src={show.thumbUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.remove();
                    }}
                  />
                ) : null}
              </div>
              <div className="legend-body">
                <h3>
                  <span className="legend-dot" style={{ background: show.color }} />
                  {show.name}
                </h3>
                <div className="sub">{subParts.join(' ／ ')}</div>
                {show.badges.length > 0 && (
                  <div className="badges">
                    {show.badges.map((badge) => (
                      <span
                        key={`${show.id}-${badge.label}`}
                        className={`badge ${badge.type === 'info' ? '' : badge.type}`.trim()}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="legend-actions">
                <FavoriteButton
                  isFavorite={isFavorite}
                  label={show.name}
                  disabled={pending}
                  onToggle={() => onToggleFavorite(show.id)}
                />
                <button
                  className="toggle"
                  type="button"
                  aria-pressed={on}
                  aria-label={`${show.name}をタイムラインに表示`}
                  onClick={() => onToggle(show.id)}
                />
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ShowLegend;
