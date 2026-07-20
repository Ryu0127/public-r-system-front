import React from 'react';
import { ProgramNote, ShowItem, TimelineItem } from '../types';

interface ShowTimelineProps {
  timeline: TimelineItem[];
  shows: ShowItem[];
  enabledShows: Record<string, boolean>;
  excludedPrograms: ProgramNote[];
  stoppedPrograms: ProgramNote[];
}

/**
 * 1日の流れタイムライン
 */
const ShowTimeline: React.FC<ShowTimelineProps> = ({
  timeline,
  shows,
  enabledShows,
  excludedPrograms,
  stoppedPrograms,
}) => {
  const colorMap = Object.fromEntries(shows.map((s) => [s.id, s.color]));

  return (
    <>
      <h2 className="tl-section-title">1日の流れ</h2>
      <p className="tl-note">
        レールの色は時間帯（朝→昼→夕→夜）を表しています。アトラクションの混雑予想は上部の「アトラクション混雑」タブへ。
      </p>

      <div className="timeline">
        {timeline.map((item, index) => {
          if (item.type === 'phase') {
            return (
              <div key={`phase-${item.label}-${index}`} className="phase">
                {item.label}
              </div>
            );
          }

          const hidden = enabledShows[item.showId] === false;
          const color = colorMap[item.showId];

          return (
            <div
              key={`slot-${item.time}-${item.showId}-${index}`}
              className={`slot${hidden ? ' is-hidden' : ''}`}
              style={color ? { ['--dot' as string]: color } : undefined}
            >
              <span className="slot-time">{item.time}</span>
              <div className="slot-card">
                <h4>{item.title}</h4>
                <p className="meta">
                  <b>{item.location}</b>
                  {item.meta ? ` ／ ${item.meta}` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="info">
        <h2>この日 開催なし・別扱いのプログラム</h2>
        <ul>
          {excludedPrograms.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong>
              {p.note ? ` — ${p.note}` : ''}
            </li>
          ))}
        </ul>
        <ul className="stopped">
          {stoppedPrograms.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong>
              {p.note ? ` — ${p.note}` : ''}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default ShowTimeline;
