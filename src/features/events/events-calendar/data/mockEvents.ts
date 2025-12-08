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
    type: 'goods',
    talentName: 'ホロライブプロダクション',
    description: '東京駅一番街 いちばんプラザにてポップアップストアを開催。0期生、hololive Indonesia 1期生、hololive English -Myth-メンバーの「感謝」の花束をモチーフにした描き下ろしイラストグッズを販売。',
    color: '#00A7E1',
    url: 'https://hololive.hololivepro.com/events/popup-2601/',
    thumbnailUrl: 'https://placehold.co/800x400/00A7E1/FFFFFF?text=POP+UP+SHOP',
  },
  // 2026年3月のイベント
  {
    id: '2',
    title: 'hololive 7th fes. Ridin\' on Dreams',
    date: '2026-03-06',
    endDate: '2026-03-08',
    type: 'concert',
    talentName: 'ホロライブプロダクション',
    description: 'ホロライブ7周年記念ライブ。3日間にわたり4つのステージで、ホロライブタレントによる歌とダンスのパフォーマンスを披露。会場は幕張メッセ 国際展示場。',
    color: '#FF1493',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FF1493/FFFFFF?text=7th+fes',
  },
  {
    id: '3',
    title: 'hololive SUPER EXPO 2026',
    date: '2026-03-06',
    endDate: '2026-03-08',
    type: 'meet',
    talentName: 'ホロライブプロダクション',
    description: 'ホロライブプロダクション全体イベント。テーマは「hololive time-warp」。3つのエリアでホロライブのさまざまな魅力を体験できます。会場は幕張メッセ 国際展示場。',
    color: '#9370DB',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/9370DB/FFFFFF?text=SUPER+EXPO',
  },
  // チケット申込
  {
    id: '4',
    title: 'hololive 7th fes. & SUPER EXPO 2026 チケット申込',
    date: '2025-12-08',
    endDate: '2025-12-22',
    type: 'application',
    talentName: 'ホロライブプロダクション',
    description: 'hololive 7th fes. Ridin\' on Dreams & hololive SUPER EXPO 2026のチケット受付。会場チケット抽選と配信チケット販売を実施。',
    color: '#FFD700',
    url: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
    thumbnailUrl: 'https://placehold.co/800x400/FFD700/FFFFFF?text=Ticket+Application',
    applicationDetails: {
      eventDate: '2026年3月6日(金)・7日(土)・8日(日)',
      eventSiteUrl: 'https://prtimes.jp/main/html/rd/p/000001203.000030268.html',
      applicationStart: '2025年12月8日(月) 20:00',
      applicationEnd: '2025年12月22日(月) 23:59',
      firstLottery: '2026年1月上旬予定',
    },
  },
];
