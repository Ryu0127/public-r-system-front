export type ShowBadgeType = 'wet' | 'entry' | 'dpa' | 'info';

export interface ShowBadge {
  type: ShowBadgeType;
  label: string;
}

export interface ShowItem {
  id: string;
  name: string;
  colorKey: string;
  color: string;
  location: string;
  duration: string;
  frequency: string | null;
  thumbUrl: string;
  badges: ShowBadge[];
  pauseFlag?: boolean;
}

export interface TimelinePhase {
  type: 'phase';
  label: string;
}

export interface TimelineSlot {
  type: 'slot';
  showId: string;
  time: string;
  title: string;
  location: string;
  meta: string;
}

export type TimelineItem = TimelinePhase | TimelineSlot;

export interface ProgramNote {
  name: string;
  note: string;
}

export interface CrowdAttraction {
  id: string;
  name: string;
  area: string;
  /** DB rankTypeLabel。未登録時は null */
  rank: 'S' | 'A' | 'B' | 'C' | null;
  /** 公式CDNサムネイルURL */
  thumbUrl: string;
  /** 公式掲載の体験所要時間（例: 約8分） */
  duration: string;
  wait: (number | null)[];
  dpaFlag?: boolean;
  priorityPassFlag?: boolean;
}

export interface CrowdData {
  slots: string[];
  attractions: CrowdAttraction[];
}

export type FoodCategory = 'limited' | 'std';

export interface FoodItem {
  id: string;
  category: FoodCategory;
  /** SVGフォールバック用（APIに無い場合は固定値） */
  icon: string;
  name: string;
  price: string;
  area: string;
  shop: string;
  timeLimit: string;
  /** 公式CDNサムネイルURL */
  thumbUrl: string;
  /** 公式サイトURL */
  officialUrl: string;
  /** メニュー内容（構成） */
  contents: string[];
  /** 期間限定の販売開始日（YYYY-MM-DD） */
  publishStartDate: string | null;
  /** 期間限定の販売終了日（YYYY-MM-DD） */
  publishEndDate: string | null;
}

export interface FoodData {
  notes: string[];
  items: FoodItem[];
}

export interface ShowtimesPark {
  id: string;
  name: string;
  nameJa: string;
  date: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  seasonTag: string;
  officialShowUrl: string;
  crowdSourceUrl: string;
}

export interface ShowtimesData {
  park: ShowtimesPark;
  shows: ShowItem[];
  timeline: TimelineItem[];
  excludedPrograms: ProgramNote[];
  stoppedPrograms: ProgramNote[];
  crowd: CrowdData;
  food: FoodData;
}

export interface ShowtimesApiResponse {
  status: boolean;
  data: ShowtimesData;
  message?: string;
}

export type ShowtimesTab = 'shows' | 'crowd' | 'food';
/** エリア絞り込み。'all' は全エリア */
export type CrowdAreaFilter = 'all' | string;
/** フードエリア絞り込み。'all' は全エリア */
export type FoodAreaFilter = 'all' | string;
/** ランク絞り込み。'all' は全ランク */
export type CrowdRankFilter = 'all' | 'S' | 'A' | 'B' | 'C';

export type RecClass = 'good' | 'ok' | 'later' | 'peak';

export interface AttractionRec {
  cls: RecClass;
  icon: string;
  text: string;
  sub: string;
}
