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
  wait: number[];
  pass: string[];
  tip: string;
}

export interface CrowdData {
  slots: string[];
  showMarkers: Record<string, string>;
  summaryNote: string;
  notes: string[];
  attractions: CrowdAttraction[];
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
  footer: {
    sources: string[];
  };
}

export interface ShowtimesApiResponse {
  status: boolean;
  data: ShowtimesData;
  message?: string;
}

export type ShowtimesTab = 'shows' | 'crowd';
export type CrowdSort = 'rec' | 'wait' | 'rank';

export type RecClass = 'good' | 'ok' | 'later' | 'peak';

export interface AttractionRec {
  cls: RecClass;
  icon: string;
  text: string;
  sub: string;
}
