import { ShowParadeApiItem } from 'hooks/api/showtimes/useShowParadesGetApi';
import { ProgramNote, ShowBadge, ShowItem, TimelineItem } from '../types';

/** park_type: 1=ランド */
export const PARK_TYPE_LAND = 1;

/** 表示用カラー（マスタに color が無いため UI 側で付与） */
const COLOR_BY_ID: Record<number, string> = {
  1: '#5FD8D2',
  2: '#7FB4F2',
  3: '#FF7E6B',
  4: '#8ED07A',
  5: '#F5C86B',
  6: '#B79BF2',
  7: '#FF9A6B',
};

const COLOR_BY_TYPE: Record<number, string> = {
  1: '#7FB4F2',
  2: '#F5C86B',
  3: '#B79BF2',
  4: '#FF9A6B',
};

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

const buildBadges = (item: ShowParadeApiItem): ShowBadge[] => {
  const badges: ShowBadge[] = [];
  if (item.entryFlag === 1) {
    badges.push({ type: 'entry', label: 'エントリー受付' });
  }
  if (item.dpaFlag === 1) {
    badges.push({ type: 'dpa', label: 'DPA対象' });
  }
  if (item.pauseFlag === 1) {
    badges.push({ type: 'info', label: '休止中' });
  }
  return badges;
};

/**
 * DBのショーパレマスタ → 画面用 ShowItem
 */
export const mapShowParadeToShowItem = (item: ShowParadeApiItem): ShowItem => {
  const id = String(item.id);
  const color =
    COLOR_BY_ID[item.id] ?? COLOR_BY_TYPE[item.showParadeType] ?? '#9AA3C7';
  const scheduleCount = (item.schedules ?? []).filter((s) => s.cancelFlag !== 1)
    .length;

  return {
    id,
    name: item.showParadeName,
    colorKey: id,
    color,
    location: item.showParadeTypeLabel ?? '',
    duration:
      item.durationMinutes != null ? `約${item.durationMinutes}分` : '',
    frequency: scheduleCount > 0 ? `1日${scheduleCount}回` : null,
    thumbUrl: item.thumbUrl ?? '',
    badges: buildBadges(item),
    pauseFlag: item.pauseFlag === 1,
  };
};

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
};

const resolvePhaseLabel = (time: string): string => {
  const minutes = toMinutes(time);
  if (minutes < 12 * 60) return '午前';
  if (minutes < 17 * 60) return '昼';
  if (minutes < 19 * 60) return '夕方';
  return '夜';
};

const buildSlotTitle = (
  showName: string,
  index: number,
  total: number,
  note: string | null
): string => {
  const isFinal = note?.includes('最終回') ?? false;
  let title = showName;
  if (total > 1) {
    title = `${showName} ${CIRCLED_NUMBERS[index] ?? `${index + 1}`}`;
  }
  if (isFinal && !title.includes('最終回')) {
    title = `${title}（最終回）`;
  }
  return title;
};

const buildSlotMeta = (
  item: ShowParadeApiItem,
  note: string | null
): string => {
  const parts: string[] = [];
  if (item.durationMinutes != null) {
    parts.push(`約${item.durationMinutes}分`);
  }
  if (item.entryFlag === 1) {
    parts.push('エントリー受付');
  }
  if (item.dpaFlag === 1) {
    parts.push('DPA対象');
  }
  if (note) {
    const cleaned = note
      .replace(/最終回\s*／\s*/g, '')
      .replace(/最終回/g, '')
      .replace(/^／\s*|／\s*$/g, '')
      .trim();
    if (cleaned) {
      parts.push(cleaned);
    }
  }
  return parts.join(' ／ ');
};

/**
 * DBのショーパレ（schedules付き）からタイムラインを組み立てる
 */
export const buildTimelineFromShowParades = (
  items: ShowParadeApiItem[]
): TimelineItem[] => {
  const activeItems = items.filter((item) => item.pauseFlag !== 1);

  type FlatSlot = {
    showParadeId: number;
    show: ShowParadeApiItem;
    startTime: string;
    note: string | null;
    indexInShow: number;
    totalInShow: number;
  };

  const flatSlots: FlatSlot[] = [];

  activeItems.forEach((show) => {
    const schedules = [...(show.schedules ?? [])]
      .filter((s) => s.cancelFlag !== 1)
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

    schedules.forEach((schedule, index) => {
      flatSlots.push({
        showParadeId: show.id,
        show,
        startTime: schedule.startTime,
        note: schedule.note,
        indexInShow: index,
        totalInShow: schedules.length,
      });
    });
  });

  flatSlots.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  const timeline: TimelineItem[] = [];
  let currentPhase: string | null = null;

  flatSlots.forEach((slot) => {
    const phase = resolvePhaseLabel(slot.startTime);
    if (phase !== currentPhase) {
      timeline.push({ type: 'phase', label: phase });
      currentPhase = phase;
    }

    timeline.push({
      type: 'slot',
      showId: String(slot.showParadeId),
      time: slot.startTime,
      title: buildSlotTitle(
        slot.show.showParadeName,
        slot.indexInShow,
        slot.totalInShow,
        slot.note
      ),
      location: slot.show.showParadeTypeLabel ?? '',
      meta: buildSlotMeta(slot.show, slot.note),
    });
  });

  return timeline;
};

/**
 * 休止中マスタを stoppedPrograms 形式へ
 */
export const mapPausedShowsToProgramNotes = (
  items: ShowParadeApiItem[]
): ProgramNote[] => {
  return items
    .filter((item) => item.pauseFlag === 1)
    .map((item) => ({
      name: item.showParadeName,
      note: '休止中',
    }));
};
