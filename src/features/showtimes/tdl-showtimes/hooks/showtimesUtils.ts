import {
  AttractionRec,
  CrowdAttraction,
  CrowdSort,
  ShowtimesData,
  ShowtimesTab,
} from '../types';

export interface TdlShowtimesState {
  config: {
    isLoading: boolean;
    error: string | null;
    activeTab: ShowtimesTab;
    enabledShows: Record<string, boolean>;
    crowdSlotIndex: number;
    crowdSort: CrowdSort;
  };
  data: {
    date: string;
    showtimes: ShowtimesData | null;
  };
}

export interface TdlShowtimesActions {
  loadData: () => Promise<void>;
  setActiveTab: (tab: ShowtimesTab) => void;
  toggleShow: (showId: string) => void;
  setCrowdSlotIndex: (index: number) => void;
  setCrowdSort: (sort: CrowdSort) => void;
}

export const waitColor = (w: number | null): string => {
  if (w == null) return '#3a4470';
  if (w <= 15) return '#22c55e';
  if (w <= 30) return '#86efac';
  if (w <= 45) return '#facc15';
  if (w <= 60) return '#fb923c';
  if (w <= 90) return '#ef4444';
  return '#a855f7';
};

export const waitTextColor = (w: number | null): string => {
  if (w == null) return '#9AA3C7';
  if (w <= 15) return '#4ade80';
  if (w <= 30) return '#86efac';
  if (w <= 45) return '#facc15';
  if (w <= 60) return '#fdba74';
  if (w <= 90) return '#f87171';
  return '#c084fc';
};

export const getAttractionRec = (
  att: CrowdAttraction,
  idx: number,
  slots: string[]
): AttractionRec => {
  const w = att.wait[idx];
  const lo = Math.min(...att.wait);
  const hi = Math.max(...att.wait);
  const ratio = hi > lo ? (w - lo) / (hi - lo) : 0;

  let ng = -1;
  for (let i = idx + 1; i < att.wait.length; i += 1) {
    if (att.wait[i] <= lo * 1.4 + 8) {
      ng = i;
      break;
    }
  }

  if (ratio <= 0.18) {
    return {
      cls: 'good',
      icon: '🟢',
      text: '今がチャンス！',
      sub: '1日の中で最も待ちが短い時間帯です',
    };
  }
  if (ratio <= 0.42) {
    return {
      cls: 'ok',
      icon: '🟡',
      text: 'まあまあ空いてる',
      sub: '比較的スムーズに乗れる見込みです',
    };
  }
  if (ratio >= 0.72) {
    return {
      cls: 'peak',
      icon: '🔴',
      text: 'ピーク帯・避けるのが無難',
      sub: `混雑中。${ng >= 0 ? `${slots[ng]}以降がねらい目` : '夜の時間帯を狙いましょう'}`,
    };
  }
  return {
    cls: 'later',
    icon: '🟠',
    text: 'やや混雑',
    sub: ng >= 0 ? `${slots[ng]}以降に空きやすくなる見込み` : '夕方以降に減少傾向',
  };
};

export const sortAttractions = (
  attractions: CrowdAttraction[],
  idx: number,
  sort: CrowdSort,
  slots: string[]
): CrowdAttraction[] => {
  const list = [...attractions];
  const rankOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };
  const recOrder: Record<string, number> = { good: 0, ok: 1, later: 2, peak: 3 };

  if (sort === 'wait') {
    list.sort((a, b) => a.wait[idx] - b.wait[idx]);
  } else if (sort === 'rank') {
    list.sort(
      (a, b) =>
        rankOrder[a.rank] - rankOrder[b.rank] || a.wait[idx] - b.wait[idx]
    );
  } else {
    list.sort((a, b) => {
      const ra = getAttractionRec(a, idx, slots);
      const rb = getAttractionRec(b, idx, slots);
      return recOrder[ra.cls] - recOrder[rb.cls] || a.wait[idx] - b.wait[idx];
    });
  }

  return list;
};
