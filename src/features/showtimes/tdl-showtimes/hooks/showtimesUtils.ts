import {
  AttractionRec,
  CrowdAttraction,
  CrowdAreaFilter,
  CrowdRankFilter,
  FoodAreaFilter,
  ShowtimesData,
  ShowtimesTab,
} from '../types';

/** TDL エリア表示順 */
export const TDL_AREA_ORDER = [
  'ワールドバザール',
  'アドベンチャーランド',
  'ウエスタンランド',
  'クリッターカントリー',
  'ファンタジーランド',
  'トゥーンタウン',
  'トゥモローランド',
] as const;

export interface TdlShowtimesState {
  config: {
    isLoading: boolean;
    error: string | null;
    activeTab: ShowtimesTab;
    enabledShows: Record<string, boolean>;
    crowdSlotIndex: number;
    crowdAreaFilter: CrowdAreaFilter;
    crowdRankFilter: CrowdRankFilter;
    foodAreaFilter: FoodAreaFilter;
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
  setCrowdAreaFilter: (area: CrowdAreaFilter) => void;
  setCrowdRankFilter: (rank: CrowdRankFilter) => void;
  setFoodAreaFilter: (area: FoodAreaFilter) => void;
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

/** ヒートマップセル上の分数ラベル用（背景色とのコントラスト） */
export const waitSegLabelColor = (w: number | null): string => {
  if (w == null) return '#c5cae0';
  if (w <= 15) return '#ffffff';
  if (w <= 30) return '#14532d';
  if (w <= 45) return '#713f12';
  if (w <= 60) return '#7c2d12';
  return '#ffffff';
};

const slotToMinutes = (slot: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(slot.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

/**
 * 現在時刻に最も近い（現在以前の直近）スロット index を返す
 */
export const findCrowdSlotIndexForNow = (
  slots: string[],
  now: Date = new Date()
): number => {
  if (!slots.length) return 0;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let selected = 0;

  for (let i = 0; i < slots.length; i += 1) {
    const minutes = slotToMinutes(slots[i]);
    if (minutes == null) continue;
    if (minutes <= nowMinutes) {
      selected = i;
    } else {
      break;
    }
  }

  return selected;
};

const validWaits = (wait: (number | null)[]): number[] =>
  wait.filter((v): v is number => v != null);

export const getAttractionRec = (
  att: CrowdAttraction,
  idx: number,
  slots: string[]
): AttractionRec => {
  const w = att.wait[idx];
  if (w == null) {
    return {
      cls: 'ok',
      icon: '⏸',
      text: '運営時間外',
      sub: 'この時刻は運営していません',
    };
  }

  const vals = validWaits(att.wait);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const ratio = hi > lo ? (w - lo) / (hi - lo) : 0;

  let ng = -1;
  for (let i = idx + 1; i < att.wait.length; i += 1) {
    const next = att.wait[i];
    if (next != null && next <= lo * 1.4 + 8) {
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

/**
 * データに存在するエリアを表示順で返す
 */
export const listAvailableAreas = (
  items: Array<{ area: string }>
): string[] => {
  const present = new Set(
    items.map((item) => item.area).filter((area) => Boolean(area))
  );
  const ordered = TDL_AREA_ORDER.filter((area) => present.has(area));
  const extras = Array.from(present)
    .filter((area) => !(TDL_AREA_ORDER as readonly string[]).includes(area))
    .sort((a, b) => a.localeCompare(b, 'ja'));
  return [...ordered, ...extras];
};
