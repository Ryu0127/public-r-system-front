import React from 'react';
import { ShowItem } from '../types';

interface ShowLegendProps {
  shows: ShowItem[];
  enabledShows: Record<string, boolean>;
  onToggle: (showId: string) => void;
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
const ShowLegend: React.FC<ShowLegendProps & { officialUrl: string }> = ({
  shows,
  enabledShows,
  onToggle,
  officialUrl,
}) => {
  return (
    <>
      <div className="official-link">
        <a href={officialUrl} target="_blank" rel="noopener noreferrer">
          各ショーの詳細は公式サイトで確認
          <ExtLinkIcon />
        </a>
      </div>

      <section className="legend" aria-label="この日に公演があるショー一覧">
        {shows.map((show) => {
          const on = enabledShows[show.id] !== false;
          const subParts = [
            show.location,
            show.duration,
            show.frequency,
          ].filter(Boolean);

          return (
            <div
              key={show.id}
              className={`legend-card${on ? '' : ' is-off'}`}
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
              <button
                className="toggle"
                type="button"
                aria-pressed={on}
                aria-label={`${show.name}をタイムラインに表示`}
                onClick={() => onToggle(show.id)}
              />
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ShowLegend;
