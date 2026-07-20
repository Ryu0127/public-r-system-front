import React, { useState } from 'react';
import { waitColor, waitSegLabelColor } from '../hooks/showtimesUtils';

interface CrowdWaitHeatmapProps {
  attractionId: string;
  slots: string[];
  wait: (number | null)[];
  slotIndex: number;
  onSlotChange: (index: number) => void;
}

/**
 * 時刻別混雑予想
 * - 広い幅: 横並びヒートマップ
 * - 狭い幅: 縦並び＋開閉（閉じ時は選択中の時刻のみ）
 * - slots / wait が無い場合は「-」
 */
const CrowdWaitHeatmap: React.FC<CrowdWaitHeatmapProps> = ({
  attractionId,
  slots,
  wait,
  slotIndex,
  onSlotChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!slots.length) {
    return (
      <div className="hmwrap">
        <div className="hmnote">時刻別混雑予想（分）</div>
        <div className="hm-empty">-</div>
      </div>
    );
  }

  const currentWait = wait[slotIndex] ?? null;
  const currentSlot = slots[slotIndex] ?? '-';
  const currentLabel = currentWait == null ? '-' : `${currentWait}分`;

  return (
    <div
      className={`hmwrap${expanded ? ' is-expanded' : ' is-collapsed'}`}
    >
      <div className="hmhead">
        <div className="hmnote">時刻別混雑予想（分）</div>
        <button
          type="button"
          className="hm-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '閉じる' : 'すべて見る'}
          <span className="hm-toggle-icon" aria-hidden="true">
            {expanded ? '▲' : '▼'}
          </span>
        </button>
      </div>

      <button
        type="button"
        className="hm-collapsed-summary"
        aria-hidden={expanded}
        tabIndex={expanded ? -1 : 0}
        aria-label={`${currentSlot} の予想待ち ${currentLabel}。クリックですべての時刻を表示`}
        onClick={() => setExpanded(true)}
      >
        <span className="hm-collapsed-time">{currentSlot}</span>
        <span
          className="hm-collapsed-wait"
          style={{
            background: waitColor(currentWait),
            color: waitSegLabelColor(currentWait),
          }}
        >
          {currentLabel}
        </span>
      </button>

      <div className="hmlist" role="group" aria-label="時刻別混雑予想">
        {slots.map((slot, i) => {
          const v = wait[i] ?? null;
          const title = `${slot}: ${v == null ? '-' : `${v}分`}`;

          return (
            <button
              key={`${attractionId}-hm-${i}`}
              type="button"
              className={`hmseg${i === slotIndex ? ' hm-now' : ''}`}
              style={{
                background: waitColor(v),
                color: waitSegLabelColor(v),
              }}
              title={title}
              aria-label={title}
              aria-pressed={i === slotIndex}
              onClick={() => {
                onSlotChange(i);
                setExpanded(false);
              }}
            >
              <span className="hmseg-time">{slot}</span>
              <span className="hmseg-val">
                {v == null ? '-' : `${v}分`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CrowdWaitHeatmap;
