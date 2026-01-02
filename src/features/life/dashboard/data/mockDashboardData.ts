/**
 * ダッシュボード用のモックデータ
 */

export interface HourlyWeather {
  time: string;
  weatherIcon: string;
  weatherText: string;
  temperature: number;
  precipitationProbability: number;
}

export interface CurrentWeather {
  temperature: number;
  weatherIcon: string;
  weatherText: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  title: string;
  description?: string;
  category: 'work' | 'personal' | 'event' | 'other';
  color: string;
}

export interface SwitchBotDevice {
  id: string;
  name: string;
  type: 'light' | 'aircon' | 'thermometer';
  isOn?: boolean;
  temperature?: number;
  humidity?: number;
  mode?: 'cool' | 'heat' | 'auto' | 'dry' | 'fan';
  targetTemp?: number;
}

/**
 * 現在の天気情報
 */
export const mockCurrentWeather: CurrentWeather = {
  temperature: 12,
  weatherIcon: '☀️',
  weatherText: '晴れ',
  humidity: 65,
  windSpeed: 3.2,
  location: '東京都渋谷区',
};

/**
 * 3時間ごとの天気予報
 */
export const mockHourlyWeather: HourlyWeather[] = [
  {
    time: '3時間後',
    weatherIcon: '☀️',
    weatherText: '晴れ',
    temperature: 13,
    precipitationProbability: 10,
  },
  {
    time: '6時間後',
    weatherIcon: '⛅',
    weatherText: '晴れ時々曇り',
    temperature: 11,
    precipitationProbability: 20,
  },
  {
    time: '9時間後',
    weatherIcon: '☁️',
    weatherText: '曇り',
    temperature: 9,
    precipitationProbability: 30,
  },
];

/**
 * 予定リスト（本日から3日分）
 */
export const mockSchedules: ScheduleItem[] = [
  // 本日（1/2）の予定
  {
    id: 1,
    date: '2026-01-02',
    time: '09:00',
    title: '朝のミーティング',
    description: 'チーム定例会議',
    category: 'work',
    color: '#3b82f6',
  },
  {
    id: 2,
    date: '2026-01-02',
    time: '14:00',
    title: 'プロジェクトレビュー',
    description: '月次進捗確認',
    category: 'work',
    color: '#3b82f6',
  },
  {
    id: 3,
    date: '2026-01-02',
    time: '18:30',
    title: '推しの配信',
    description: 'YouTube配信視聴',
    category: 'event',
    color: '#ef4444',
  },
  // 明日（1/3）の予定
  {
    id: 4,
    date: '2026-01-03',
    time: '10:00',
    title: 'クライアント打ち合わせ',
    description: '新規案件の相談',
    category: 'work',
    color: '#3b82f6',
  },
  {
    id: 5,
    date: '2026-01-03',
    time: '15:00',
    title: '歯医者',
    description: '定期検診',
    category: 'personal',
    color: '#10b981',
  },
  {
    id: 6,
    date: '2026-01-03',
    time: '20:00',
    title: '推しのライブ配信',
    description: 'メンバーシップ限定配信',
    category: 'event',
    color: '#ef4444',
  },
  // 明後日（1/4）の予定
  {
    id: 7,
    date: '2026-01-04',
    time: '11:00',
    title: '友人とランチ',
    description: '駅前のカフェ',
    category: 'personal',
    color: '#10b981',
  },
  {
    id: 8,
    date: '2026-01-04',
    time: '14:00',
    title: 'イベント参加',
    description: '推しのファンミーティング',
    category: 'event',
    color: '#ef4444',
  },
];

/**
 * SwitchBotデバイス情報
 */
export const mockSwitchBotDevices: SwitchBotDevice[] = [
  {
    id: '1',
    name: 'リビングの照明',
    type: 'light',
    isOn: true,
  },
  {
    id: '2',
    name: '寝室の照明',
    type: 'light',
    isOn: false,
  },
  {
    id: '3',
    name: 'リビングエアコン',
    type: 'aircon',
    isOn: true,
    mode: 'heat',
    targetTemp: 24,
  },
  {
    id: '4',
    name: '室内温湿度計',
    type: 'thermometer',
    temperature: 22.5,
    humidity: 55,
  },
];
