import React, { useMemo } from 'react';
import { CrowdData, CrowdSort } from '../types';
import {
  getAttractionRec,
  sortAttractions,
  waitColor,
  waitTextColor,
} from '../hooks/showtimesUtils';

interface CrowdPanelProps {
  crowd: CrowdData;
  crowdSourceUrl: string;
  slotIndex: number;
  sort: CrowdSort;
  onSlotChange: (index: number) => void;
  onSortChange: (sort: CrowdSort) => void;
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

const avgByRank = (
  attractions: CrowdData['attractions'],
  rank: string,
  idx: number
): string => {
  const waits = attractions.filter((a) => a.rank === rank).map((a) => a.wait[idx]);
  if (!waits.length) return '—';
  return `${Math.round(waits.reduce((a, b) => a + b, 0) / waits.length)}分`;
};

const crowdNum = (attractions: CrowdData['attractions'], idx: number): number => {
  const waits = attractions.map((a) => a.wait[idx]);
  return Math.round(waits.reduce((a, b) => a + b, 0) / waits.length);
};

/**
 * アトラクション混雑タブ
 */
const CrowdPanel: React.FC<CrowdPanelProps> = ({
  crowd,
  crowdSourceUrl,
  slotIndex,
  sort,
  onSlotChange,
  onSortChange,
}) => {
  const slots = crowd.slots;
  const showMarkers = crowd.showMarkers;
  const ci = crowdNum(crowd.attractions, slotIndex);

  let gaugeColor = '#ef4444';
  let gaugeLabel = 'かなり混雑 ⚠';
  if (ci <= 15) {
    gaugeColor = '#22c55e';
    gaugeLabel = '空いています ✓';
  } else if (ci <= 30) {
    gaugeColor = '#86efac';
    gaugeLabel = 'やや空き気味';
  } else if (ci <= 45) {
    gaugeColor = '#facc15';
    gaugeLabel = 'そこそこ混雑';
  } else if (ci <= 60) {
    gaugeColor = '#fb923c';
    gaugeLabel = '混んでいます';
  }

  const sorted = useMemo(
    () => sortAttractions(crowd.attractions, slotIndex, sort, slots),
    [crowd.attractions, slotIndex, sort, slots]
  );

  return (
    <>
      <div className="official-link">
        <a href={crowdSourceUrl} target="_blank" rel="noopener noreferrer">
          アトラクション別の実測ヒートマップ（urtrip・毎日更新）
          <ExtLinkIcon />
        </a>
      </div>

      <div className="tp-card">
        <div className="tp-label">📍 パーク内の時刻を選択</div>
        <div className="tp-time">
          {slots[slotIndex]}
          <span>の状況</span>
        </div>
        <input
          className="tslider"
          type="range"
          min={0}
          max={slots.length - 1}
          value={slotIndex}
          step={1}
          aria-label="時刻を選択"
          onChange={(e) => onSlotChange(Number(e.target.value))}
        />
        <div className="slabels">
          <span>9:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
          <span>20:45</span>
        </div>
      </div>

      <div className="sum-card">
        <div className="sum-title">{crowd.summaryNote}</div>
        <div className="sum-row">
          <div className="sum-chip">
            <div className="sum-chip-val" style={{ color: '#B79BF2' }}>
              {avgByRank(crowd.attractions, 'S', slotIndex)}
            </div>
            <div className="sum-chip-lbl">S平均</div>
          </div>
          <div className="sum-chip">
            <div className="sum-chip-val" style={{ color: '#FF9A6B' }}>
              {avgByRank(crowd.attractions, 'A', slotIndex)}
            </div>
            <div className="sum-chip-lbl">A平均</div>
          </div>
          <div className="sum-chip">
            <div className="sum-chip-val" style={{ color: '#F5C86B' }}>
              {avgByRank(crowd.attractions, 'B', slotIndex)}
            </div>
            <div className="sum-chip-lbl">B平均</div>
          </div>
          <div className="sum-chip">
            <div className="sum-chip-val" style={{ color: '#8ED07A' }}>
              {avgByRank(crowd.attractions, 'C', slotIndex)}
            </div>
            <div className="sum-chip-lbl">C平均</div>
          </div>
          <div className="sum-chip">
            <div className="sum-chip-val" style={{ color: '#7FB4F2' }}>
              {ci}分
            </div>
            <div className="sum-chip-lbl">混雑指数</div>
          </div>
        </div>
      </div>

      <div className="gauge">
        <div>
          <div className="glabel">全体混雑</div>
          <div className="gnum" style={{ color: gaugeColor }}>
            {ci}
          </div>
        </div>
        <div className="gright">
          <div className="gbar-bg">
            <div
              className="gbar-fill"
              style={{
                width: `${Math.min(100, Math.round(ci / 0.9))}%`,
                background: gaugeColor,
              }}
            />
          </div>
          <div className="gtext" style={{ color: gaugeColor }}>
            {gaugeLabel}
          </div>
        </div>
      </div>

      <div className="wlegend">
        <span className="li">
          <span className="ld" style={{ background: '#22c55e' }} />
          〜15分
        </span>
        <span className="li">
          <span className="ld" style={{ background: '#86efac' }} />
          〜30分
        </span>
        <span className="li">
          <span className="ld" style={{ background: '#facc15' }} />
          〜45分
        </span>
        <span className="li">
          <span className="ld" style={{ background: '#fb923c' }} />
          〜60分
        </span>
        <span className="li">
          <span className="ld" style={{ background: '#ef4444' }} />
          〜90分
        </span>
        <span className="li">
          <span className="ld" style={{ background: '#a855f7' }} />
          90分超
        </span>
        <span className="li">
          <span
            className="ld"
            style={{ background: '#F5C86B', borderRadius: '50%' }}
          />
          ▼=ショーパレ開催時刻
        </span>
      </div>

      <div className="sortbar">
        {(
          [
            ['rec', '🎯 おすすめ順'],
            ['wait', '⏱ 待ち時間順'],
            ['rank', '🏆 人気順'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`sbtn${sort === key ? ' active' : ''}`}
            onClick={() => onSortChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {sorted.map((att) => {
          const w = att.wait[slotIndex];
          const rec = getAttractionRec(att, slotIndex, slots);
          const lo = Math.min(...att.wait);
          const hi = Math.max(...att.wait);
          const loI = att.wait.indexOf(lo);
          const hiI = att.wait.indexOf(hi);
          const p = att.pass[slotIndex];
          const marker = showMarkers[String(slotIndex)];

          return (
            <div key={att.id} className={`acard rc-${rec.cls}`}>
              <div className="atop">
                <div className={`rbadge r${att.rank}`}>{att.rank}</div>
                <div className="aname">
                  {att.name}
                  <span className="aarea">{att.area}</span>
                </div>
                <div className="wnow">
                  <div className="wnow-num" style={{ color: waitTextColor(w) }}>
                    {w}
                  </div>
                  <div className="wnow-unit">分待ち(目安)</div>
                </div>
              </div>

              <div className="rec-line">
                <span className={`rbadge-rec ${rec.cls}`}>
                  {rec.icon} {rec.text}
                </span>
                {p === 'A' && <span className="pass-badge pA">DPA販売中</span>}
                {p === 'P' && (
                  <span className="pass-badge pP">プライオリティパス発行中</span>
                )}
              </div>
              <div className="rsub">{rec.sub}</div>

              <div className="hmwrap">
                <div className="hmnote">▼=ショーパレ時刻 ｜ 白枠=選択中の時刻</div>
                <div className="hmbar">
                  {att.wait.map((v, i) => {
                    const markerLabel = showMarkers[String(i)];
                    const title = `${slots[i]}: ${v}分${
                      markerLabel ? ` ｜ ${markerLabel}` : ''
                    }`;
                    return (
                      <div
                        key={`${att.id}-hm-${i}`}
                        className={`hmseg${i === slotIndex ? ' hm-now' : ''}${
                          markerLabel ? ' hm-show' : ''
                        }`}
                        style={{ background: waitColor(v) }}
                        title={title}
                      />
                    );
                  })}
                </div>
                <div className="hmticks">
                  <span>9:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>20:45</span>
                </div>
              </div>

              <div className="astats">
                <div className="astat">
                  <div className="astat-val" style={{ color: waitTextColor(lo) }}>
                    {lo}分
                  </div>
                  <div className="astat-lbl">最短待ち</div>
                  <div className="astat-sub">{slots[loI]}頃</div>
                </div>
                <div className="astat">
                  <div className="astat-val" style={{ color: waitTextColor(w) }}>
                    {w}分
                  </div>
                  <div className="astat-lbl">選択時刻の推定</div>
                  <div className="astat-sub">{slots[slotIndex]}</div>
                </div>
                <div className="astat">
                  <div className="astat-val" style={{ color: waitTextColor(hi) }}>
                    {hi}分
                  </div>
                  <div className="astat-lbl">ピーク待ち</div>
                  <div className="astat-sub">{slots[hiI]}頃</div>
                </div>
              </div>

              <div className="atip">💡 {att.tip}</div>
              {marker && (att.rank === 'S' || att.rank === 'A') && (
                <div className="atip" style={{ marginTop: 8 }}>
                  🎪 <b>{marker}</b> 開催時刻 — 観客がショー・パレードに集中し、待ちが下がる場合があります
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="crowd-note">
        {crowd.notes.map((note, i) => (
          <React.Fragment key={note}>
            ※ {note}
            {i < crowd.notes.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default CrowdPanel;
