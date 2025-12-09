import { HololiveEvent } from '../types';

/**
 * モックイベントデータ
 */
export const mockEvents: HololiveEvent[] = [
  // 2026年1月のイベント
  {
    id: '1',
    title: 'hololive production OFFICIAL POP UP SHOP',
    date: '2026-01-09',
    endDate: '2026-01-22',
    startTime: '10:00',
    endTime: '20:30',
    type: 'goods',
    talentNames: ['ホロライブプロダクション'],
    description: `東京駅一番街 いちばんプラザにてポップアップストアを開催。0期生、hololive Indonesia 1期生、hololive English -Myth-メンバーの「感謝」の花束をモチーフにした描き下ろしイラストグッズを販売。

【営業時間】10:00 〜 20:30
※1月22日は18:00までの営業となります。

【来場予約について】
一部日時は事前抽選による予約制となります。
■事前抽選実施対象日時
・1月9日（金）10:00～12:00
・1月10日（土）10:00～12:00
・1月11日（日）10:00～12:00
・1月16日（金）10:00～12:00
・1月17日（土）10:00～12:00
・1月18日（日）10:00～12:00

【購入者ノベルティ】
※特典はなくなり次第終了となります。
クリアカード・ポストカードは、開催期間の前半/後半で絵柄が異なります！
・前半：1月9日（金）〜1月15日（木）
・後半：1月16日（金）〜1月22日（木）

① オリジナルショッパー（全1種）
  11,000円（税込）以上のお買い上げで1点プレゼント

② メッセージカード（全3種/ランダム）
  1会計ごとに1点プレゼント

③ ポストカード（全11種/ランダム/上限11枚）
  2,200円（税込）ごとに1点プレゼント

④ クリアカード（全11種/ランダム/上限11枚）
  5,500円（税込）ごとに1点プレゼント`,
    color: '#00A7E1',
    url: 'https://hololive.hololivepro.com/events/popup-2601/',
    thumbnailUrl: 'https://placehold.co/800x400/00A7E1/FFFFFF?text=POP+UP+SHOP',
    location: '東京駅一番街内「いちばんプラザ」',
    notes: [
      '※1月22日は18:00までの営業となります。',
      '※一部日時は事前抽選による予約制となります。',
    ],
  },
  // 2026年3月のイベント
  {
    id: '2',
    title: 'hololive 7th fes. Ridin\' on Dreams',
    date: '2026-03-06',
    endDate: '2026-03-08',
    type: 'concert',
    talentNames: ['ホロライブプロダクション'],
    description: 'ホロライブ7周年記念ライブ。3日間にわたり4つのステージで、ホロライブタレントによる歌とダンスのパフォーマンスを披露。',
    color: '#FF1493',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FF1493/FFFFFF?text=7th+fes',
    location: '幕張メッセ 国際展示場',
  },
  {
    id: '3',
    title: 'hololive SUPER EXPO 2026',
    date: '2026-03-06',
    endDate: '2026-03-08',
    type: 'meet',
    talentNames: ['ホロライブプロダクション'],
    description: 'ホロライブプロダクション全体イベント。テーマは「hololive time-warp」。3つのエリアでホロライブのさまざまな魅力を体験できます。',
    color: '#9370DB',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/9370DB/FFFFFF?text=SUPER+EXPO',
    location: '幕張メッセ 国際展示場',
  },
  // チケット申込
  {
    id: '4',
    title: 'hololive 7th fes. & SUPER EXPO 2026 1次先行申込',
    date: '2025-12-08',
    endDate: '2025-12-14',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. Ridin\' on Dreams & hololive SUPER EXPO 2026の1次先行チケット申込受付期間。',
    color: '#FFD700',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FFD700/FFFFFF?text=1st+Application',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      applicationStart: '2025年12月8日(月) 20:00',
      applicationEnd: '2025年12月14日(日) 23:59',
      notes: [
        '※1次先行のお申込みには、ホロライブ公式のファンクラブ「hololive FANCLUB」への入会が必要です。',
      ],
    },
  },
  {
    id: '5',
    title: 'hololive 7th fes. & SUPER EXPO 2026 当落〜入金期間 (1次)',
    date: '2025-12-18',
    endDate: '2025-12-22',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. & SUPER EXPO 2026 1次先行の当落発表および入金期間。',
    color: '#FF6347',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FF6347/FFFFFF?text=Result+Payment',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      firstLottery: '2025年12月18日(木) 15:00 当落発表',
      applicationEnd: '2025年12月22日(月) 23:00 入金締切',
    },
  },
  // 2次先行
  {
    id: '6',
    title: 'hololive 7th fes. & SUPER EXPO 2026 2次先行申込',
    date: '2025-12-19',
    endDate: '2025-12-23',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. Ridin\' on Dreams & hololive SUPER EXPO 2026の2次先行チケット申込受付期間（ローチケ先行 / 抽選）。',
    color: '#32CD32',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/32CD32/FFFFFF?text=2nd+Application',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      applicationStart: '2025年12月19日(金) 12:00',
      applicationEnd: '2025年12月23日(火) 23:59',
      notes: [
        '※座席番号の表示開始日時: 2026年3月5日（木）正午12:00〜',
      ],
    },
  },
  {
    id: '7',
    title: 'hololive 7th fes. & SUPER EXPO 2026 当落〜入金期間 (2次)',
    date: '2025-12-27',
    endDate: '2026-01-05',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. & SUPER EXPO 2026 2次先行の当落発表および入金期間。',
    color: '#FF8C00',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FF8C00/FFFFFF?text=Result+Payment',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      firstLottery: '2025年12月27日(土) 15:00 当落発表',
      applicationEnd: '2026年1月5日(月) 23:00 入金締切',
    },
  },
  // 3次先行
  {
    id: '8',
    title: 'hololive 7th fes. & SUPER EXPO 2026 3次先行申込',
    date: '2025-12-28',
    endDate: '2026-01-07',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. Ridin\' on Dreams & hololive SUPER EXPO 2026の3次先行チケット申込受付期間（ローチケ先行 / 抽選）。',
    color: '#4169E1',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/4169E1/FFFFFF?text=3rd+Application',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      applicationStart: '2025年12月28日(日) 12:00',
      applicationEnd: '2026年1月7日(水) 23:59',
      notes: [
        '※座席番号の表示開始日時: 2026年3月5日（木）正午12:00〜',
      ],
    },
  },
  {
    id: '9',
    title: 'hololive 7th fes. & SUPER EXPO 2026 当落〜入金期間 (3次)',
    date: '2026-01-14',
    endDate: '2026-01-19',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. & SUPER EXPO 2026 3次先行の当落発表および入金期間。',
    color: '#DC143C',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/DC143C/FFFFFF?text=Result+Payment',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      firstLottery: '2026年1月14日(水) 15:00 当落発表',
      applicationEnd: '2026年1月19日(月) 23:00 入金締切',
    },
  },
  // 一般発売
  {
    id: '10',
    title: 'hololive 7th fes. & SUPER EXPO 2026 一般発売',
    date: '2026-02-01',
    endDate: '2026-03-08',
    type: 'application',
    talentNames: ['ホロライブプロダクション'],
    description: 'hololive 7th fes. Ridin\' on Dreams & hololive SUPER EXPO 2026の一般発売チケット受付（ローチケ / 先着）。',
    color: '#9932CC',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/9932CC/FFFFFF?text=General+Sale',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      applicationStart: '2026年2月1日(日) 12:00',
      notes: [
        '※先着順での販売となります。',
        '※座席番号の表示開始日時: 2026年3月5日（木）正午12:00〜',
      ],
    },
  },
];
