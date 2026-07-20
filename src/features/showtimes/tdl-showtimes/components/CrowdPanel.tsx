import React, { useMemo } from 'react';
import {
  CrowdAreaFilter,
  CrowdAttraction,
  CrowdData,
  CrowdRankFilter,
} from '../types';
import {
  getAttractionRec,
  listAvailableAreas,
  waitTextColor,
} from '../hooks/showtimesUtils';
import AttractionThumb from './AttractionThumb';
import CrowdWaitHeatmap from './CrowdWaitHeatmap';

const RANK_FILTERS: Array<'S' | 'A' | 'B' | 'C'> = ['S', 'A', 'B', 'C'];

const RANK_COLORS: Record<'S' | 'A' | 'B' | 'C', string> = {
  S: '#B79BF2',
  A: '#FF9A6B',
  B: '#F5C86B',
  C: '#8ED07A',
};

interface CrowdPanelProps {
  crowd: CrowdData;
  crowdSourceUrl: string;
  slotIndex: number;
  areaFilter: CrowdAreaFilter;
  rankFilter: CrowdRankFilter;
  onSlotChange: (index: number) => void;
  onAreaFilterChange: (area: CrowdAreaFilter) => void;
  onRankFilterChange: (rank: CrowdRankFilter) => void;
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
  const waits = attractions
    .filter((a) => a.rank === rank)
    .map((a) => a.wait[idx])
    .filter((v): v is number => v != null);
  if (!waits.length) return '-';
  return `${Math.round(waits.reduce((a, b) => a + b, 0) / waits.length)}分`;
};

const crowdNum = (attractions: CrowdData['attractions'], idx: number): number | null => {
  const waits = attractions
    .map((a) => a.wait[idx])
    .filter((v): v is number => v != null);
  if (!waits.length) return null;
  return Math.round(waits.reduce((a, b) => a + b, 0) / waits.length);
};

/**
 * アトラクション混雑タブ
 */
const CrowdPanel: React.FC<CrowdPanelProps> = ({
  crowd,
  crowdSourceUrl,
  slotIndex,
  areaFilter,
  rankFilter,
  onSlotChange,
  onAreaFilterChange,
  onRankFilterChange,
}) => {
  const slots = crowd.slots;
  const ci = crowdNum(crowd.attractions, slotIndex);
  const hasCrowdIndex = ci != null;

  let gaugeColor = '#9AA3C7';
  let gaugeLabel = '-';
  if (hasCrowdIndex) {
    gaugeColor = '#ef4444';
    gaugeLabel = 'かなり混雑 ⚠';
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
  }

  const areas = useMemo(
    () => listAvailableAreas(crowd.attractions),
    [crowd.attractions]
  );

  const filtered = useMemo(() => {
    return crowd.attractions.filter((att) => {
      if (areaFilter !== 'all' && att.area !== areaFilter) return false;
      if (rankFilter !== 'all' && att.rank !== rankFilter) return false;
      return true;
    });
  }, [crowd.attractions, areaFilter, rankFilter]);

  const handleRankClick = (rank: 'S' | 'A' | 'B' | 'C') => {
    onRankFilterChange(rankFilter === rank ? 'all' : rank);
  };

  return (
    <>
      <div className="official-link">
        <a href={crowdSourceUrl} target="_blank" rel="noopener noreferrer">
          アトラクション別の実測ヒートマップ（urtrip・毎日更新）
          <ExtLinkIcon />
        </a>
      </div>

      <div className="gauge mt-10">
        <div>
          <div className="glabel">全体混雑</div>
          <div className="gnum" style={{ color: gaugeColor }}>
            {hasCrowdIndex ? ci : '-'}
          </div>
        </div>
        <div className="gright">
          <div className="gbar-bg">
            <div
              className="gbar-fill"
              style={{
                width: hasCrowdIndex
                  ? `${Math.min(100, Math.round(ci / 0.9))}%`
                  : '0%',
                background: gaugeColor,
              }}
            />
          </div>
          <div className="gtext" style={{ color: gaugeColor }}>
            {gaugeLabel}
          </div>
        </div>
      </div>

      <div className="sum-card mt-8">
        <div
          className="sum-row"
          role="group"
          aria-label="ランク別平均待ち時間で絞り込み"
        >
          {RANK_FILTERS.map((rank) => (
            <button
              key={rank}
              type="button"
              className={`sum-chip${rankFilter === rank ? ' active' : ''}`}
              aria-pressed={rankFilter === rank}
              onClick={() => handleRankClick(rank)}
            >
              <div className="sum-chip-lbl">{rank}平均</div>
              <div
                className="sum-chip-val"
                style={{ color: RANK_COLORS[rank] }}
              >
                {avgByRank(crowd.attractions, rank, slotIndex)}
              </div>
            </button>
          ))}
          <div className="sum-chip sum-chip-static">
            <div className="sum-chip-lbl">混雑指数</div>
            <div className="sum-chip-val" style={{ color: '#7FB4F2' }}>
              {hasCrowdIndex ? `${ci}分` : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="areabar" role="group" aria-label="エリアで絞り込み">
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
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="status-box">
            この条件のアトラクションはありません
          </div>
        ) : (
          filtered.map((att) => {
            const hasSlots = slots.length > 0;
            const w = hasSlots ? (att.wait[slotIndex] ?? null) : null;
            const rec = getAttractionRec(att, slotIndex, slots);
            const vals = att.wait.filter((v): v is number => v != null);
            const hasWaitStats = vals.length > 0;
            const lo = hasWaitStats ? Math.min(...vals) : null;
            const hi = hasWaitStats ? Math.max(...vals) : null;
            const loI = hasWaitStats && lo != null ? att.wait.indexOf(lo) : -1;
            const hiI = hasWaitStats && hi != null ? att.wait.indexOf(hi) : -1;

            return (
              <div key={att.id} className={`acard rc-${rec.cls}`}>
                <div className="atop">
                  <AttractionThumb
                    rank={att.rank}
                    thumbUrl={att.thumbUrl}
                  />
                  <div
                    className={`rbadge${att.rank ? ` r${att.rank}` : ' rNone'}`}
                  >
                    {att.rank ?? '未登録'}
                  </div>
                  <div className="aname">
                    {att.name}
                    <span className="aarea">
                      {att.area}
                      {att.duration ? ` ／ 所要${att.duration}` : ''}
                    </span>
                    {(att.dpaFlag || att.priorityPassFlag) && (
                      <div className="badges">
                        {att.dpaFlag && (
                          <span className="badge dpa">DPA対象</span>
                        )}
                        {att.priorityPassFlag && (
                          <span className="badge pp">プライオリティパス対象</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="wnow">
                    <div className="wnow-num" style={{ color: waitTextColor(w) }}>
                      {w == null ? '-' : w}
                    </div>
                    <div className="wnow-unit">
                      {w == null ? '-' : '分待ち(目安)'}
                    </div>
                  </div>
                </div>

                <CrowdWaitHeatmap
                  attractionId={att.id}
                  slots={slots}
                  wait={att.wait}
                  slotIndex={slotIndex}
                  onSlotChange={onSlotChange}
                />

                <div className="astats">
                  <div className="astat">
                    <div
                      className="astat-val"
                      style={{ color: waitTextColor(lo) }}
                    >
                      {lo == null ? '-' : `${lo}分`}
                    </div>
                    <div className="astat-lbl">最短待ち</div>
                    <div className="astat-sub">
                      {loI >= 0 && slots[loI] ? `${slots[loI]}頃` : '-'}
                    </div>
                  </div>
                  <div className="astat">
                    <div
                      className="astat-val"
                      style={{ color: waitTextColor(w) }}
                    >
                      {w == null ? '-' : `${w}分`}
                    </div>
                    <div className="astat-lbl">選択時刻の推定</div>
                    <div className="astat-sub">
                      {hasSlots && slots[slotIndex] ? slots[slotIndex] : '-'}
                    </div>
                  </div>
                  <div className="astat">
                    <div
                      className="astat-val"
                      style={{ color: waitTextColor(hi) }}
                    >
                      {hi == null ? '-' : `${hi}分`}
                    </div>
                    <div className="astat-lbl">ピーク待ち</div>
                    <div className="astat-sub">
                      {hiI >= 0 && slots[hiI] ? `${slots[hiI]}頃` : '-'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default CrowdPanel;
