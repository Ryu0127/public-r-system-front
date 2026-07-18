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
  rank: 'S' | 'A' | 'B' | 'C';
  /** SVGフォールバック用アイコン種別（当面モック由来） */
  icon: string;
  /** 公式CDNサムネイルURL */
  thumbUrl: string;
  /** 公式掲載の体験所要時間（例: 約8分） */
  duration: string;
  wait: (number | null)[];
  pass: string[];
  dpaFlag?: boolean;
  priorityPassFlag?: boolean;
}

export interface CrowdData {
  slots: string[];
  showMarkers: Record<string, string>;
  summaryNote: string;
  notes: string[];
  attractions: CrowdAttraction[];
}

export type FoodCategory = 'summer' | 'std';

export interface FoodItem {
  id: string;
  category: FoodCategory;
  icon: string;
  name: string;
  price: string;
  area: string;
  shop: string;
  note: string;
  timeLimit: string;
  /** 公式CDNサムネイルURL */
  thumbUrl: string;
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
  footer: {
    sources: string[];
  };
}

export interface ShowtimesApiResponse {
  status: boolean;
  data: ShowtimesData;
  message?: string;
}

export type ShowtimesTab = 'shows' | 'crowd' | 'food';
/** エリア絞り込み。'all' は全エリア */
export type CrowdAreaFilter = 'all' | string;
/** ランク絞り込み。'all' は全ランク */
export type CrowdRankFilter = 'all' | CrowdAttraction['rank'];
/** フードカテゴリ絞り込み */
export type FoodCategoryFilter = 'all' | FoodCategory;

export type RecClass = 'good' | 'ok' | 'later' | 'peak';

export interface AttractionRec {
  cls: RecClass;
  icon: string;
  text: string;
  sub: string;
}
