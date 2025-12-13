import {
  HololiveEvent,
  EventListResponse,
  EventDetailResponse,
  EventMutationResponse,
  EventDeleteResponse,
  EventStatus,
} from '../types';

/**
 * モックイベントデータ（実際のデータ）
 */
const mockEventsData: HololiveEvent[] = [
  {
    id: '1',
    title: 'hololive production OFFICIAL POP UP SHOP',
    date: '2026-01-09',
    endDate: '2026-01-22',
    startTime: '10:00',
    endTime: '20:30',
    type: 'goods',
    talentNames: ['ホロライブプロダクション', 'さくらみこ', '星街すいせい'],
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
    color: '#1E90FF',
    url: 'https://hololive.hololivepro.com/events/popup-2601/',
    thumbnailUrl: 'https://placehold.co/800x400/1E90FF/FFFFFF?text=POP+UP+SHOP',
    location: '東京駅一番街内「いちばんプラザ」',
    notes: [
      '※1月22日は18:00までの営業となります。',
      '※一部日時は事前抽選による予約制となります。',
    ],
    status: 'draft' as EventStatus,
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-10T15:30:00.000Z',
  },
];

/**
 * モックAPIレスポンス: イベント一覧取得
 */
export const mockEventListResponse: EventListResponse = {
  success: true,
  data: mockEventsData,
  message: 'イベント一覧を取得しました',
};

/**
 * モックAPIレスポンス: イベント詳細取得
 */
export const getMockEventDetailResponse = (id: string): EventDetailResponse => {
  const event = mockEventsData.find((e) => e.id === id);

  if (!event) {
    return {
      success: false,
      data: {} as HololiveEvent,
      error: `ID: ${id} のイベントが見つかりませんでした`,
    };
  }

  return {
    success: true,
    data: event,
    message: 'イベント詳細を取得しました',
  };
};

/**
 * モックAPIレスポンス: イベント作成
 */
export const createMockEventResponse = (eventData: Partial<HololiveEvent>): EventMutationResponse => {
  const newEvent: HololiveEvent = {
    id: `event-${Date.now()}`,
    title: eventData.title || '',
    date: eventData.date || '',
    type: eventData.type || 'other',
    talentNames: eventData.talentNames || [],
    color: eventData.color || '#000000',
    ...eventData,
    status: eventData.status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as HololiveEvent;

  // モックデータに追加（実際のAPIでは不要）
  mockEventsData.unshift(newEvent);

  return {
    success: true,
    data: newEvent,
    message: 'イベントを作成しました',
  };
};

/**
 * モックAPIレスポンス: イベント更新
 */
export const updateMockEventResponse = (
  id: string,
  eventData: Partial<HololiveEvent>
): EventMutationResponse => {
  const index = mockEventsData.findIndex((e) => e.id === id);

  if (index === -1) {
    return {
      success: false,
      data: {} as HololiveEvent,
      error: `ID: ${id} のイベントが見つかりませんでした`,
    };
  }

  const updatedEvent: HololiveEvent = {
    ...mockEventsData[index],
    ...eventData,
    updatedAt: new Date().toISOString(),
  };

  // モックデータを更新（実際のAPIでは不要）
  mockEventsData[index] = updatedEvent;

  return {
    success: true,
    data: updatedEvent,
    message: 'イベントを更新しました',
  };
};

/**
 * モックAPIレスポンス: イベント削除
 */
export const deleteMockEventResponse = (id: string): EventDeleteResponse => {
  const index = mockEventsData.findIndex((e) => e.id === id);

  if (index === -1) {
    return {
      success: false,
      data: { id },
      error: `ID: ${id} のイベントが見つかりませんでした`,
    };
  }

  // モックデータから削除（実際のAPIでは不要）
  mockEventsData.splice(index, 1);

  return {
    success: true,
    data: { id },
    message: 'イベントを削除しました',
  };
};

/**
 * 後方互換性のため: 直接データ配列を取得する関数
 */
export const mockEvents = mockEventsData;
