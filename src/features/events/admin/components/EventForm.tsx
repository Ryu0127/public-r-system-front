import React, { useState } from 'react';
import { HololiveEvent, EventType, EventStatus } from '../../events-calendar/types';

interface EventFormProps {
  event?: HololiveEvent;
  onSave: (event: Partial<HololiveEvent>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<HololiveEvent>>({
    title: '',
    talentName: '',
    date: '',
    startTime: '',
    endTime: '',
    endDate: '',
    type: 'other',
    color: '#000000',
    description: '',
    url: '',
    thumbnailUrl: '',
    location: '',
    status: 'draft',
    ...event,
  });

  const [notes, setNotes] = useState<string>(
    event?.notes?.join('\n') || ''
  );

  const [applicationDetails, setApplicationDetails] = useState({
    eventDate: event?.applicationDetails?.eventDate || '',
    eventSiteUrl: event?.applicationDetails?.eventSiteUrl || '',
    firstLottery: event?.applicationDetails?.firstLottery || '',
    secondLottery: event?.applicationDetails?.secondLottery || '',
    applicationStart: event?.applicationDetails?.applicationStart || '',
    applicationEnd: event?.applicationDetails?.applicationEnd || '',
    notes: event?.applicationDetails?.notes?.join('\n') || '',
  });

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'anniversary', label: '記念配信' },
    { value: 'live', label: 'ライブ' },
    { value: 'concert', label: 'コンサート' },
    { value: 'meet', label: 'リアルイベント・ミート' },
    { value: 'collab', label: 'コラボ配信' },
    { value: 'birthday', label: '誕生日配信' },
    { value: 'goods', label: 'グッズ' },
    { value: 'voice', label: 'ボイス' },
    { value: 'application', label: 'イベント申込' },
    { value: 'other', label: 'その他' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplicationDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplicationDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (status: EventStatus) => {
    const eventData: Partial<HololiveEvent> = {
      ...formData,
      status,
      notes: notes.split('\n').filter((n) => n.trim()),
    };

    // イベント申込の場合は詳細情報を含める
    if (formData.type === 'application') {
      eventData.applicationDetails = {
        eventDate: applicationDetails.eventDate || undefined,
        eventSiteUrl: applicationDetails.eventSiteUrl || undefined,
        firstLottery: applicationDetails.firstLottery || undefined,
        secondLottery: applicationDetails.secondLottery || undefined,
        applicationStart: applicationDetails.applicationStart || undefined,
        applicationEnd: applicationDetails.applicationEnd || undefined,
        notes: applicationDetails.notes
          ? applicationDetails.notes.split('\n').filter((n) => n.trim())
          : undefined,
      };
    }

    // ISO8601形式のタイムスタンプを追加
    if (!event) {
      eventData.createdAt = new Date().toISOString();
    }
    eventData.updatedAt = new Date().toISOString();

    onSave(eventData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {event ? 'イベント編集' : 'イベント新規登録'}
      </h2>

      <div className="space-y-4">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              タイトル<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              タレント名<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="talentName"
              value={formData.talentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              イベント種別<span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              イメージカラー<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 border rounded"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* 日時情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              開始日<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">終了日（期間のあるイベント）</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">開始時刻</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">終了時刻</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* 詳細情報 */}
        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">サムネイルURL</label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">開催場所</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">注意事項（1行に1項目）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            placeholder="注意事項を1行ずつ入力してください"
          />
        </div>

        {/* イベント申込詳細（種別が'application'の場合のみ表示） */}
        {formData.type === 'application' && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">イベント申込詳細情報</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">イベント開催日時</label>
                  <input
                    type="text"
                    name="eventDate"
                    value={applicationDetails.eventDate}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="2025年12月20日（土）15:00〜"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">イベントサイトURL</label>
                  <input
                    type="url"
                    name="eventSiteUrl"
                    value={applicationDetails.eventSiteUrl}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">1次抽選日時</label>
                  <input
                    type="text"
                    name="firstLottery"
                    value={applicationDetails.firstLottery}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="2025年12月15日（月）12:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">2次抽選日時</label>
                  <input
                    type="text"
                    name="secondLottery"
                    value={applicationDetails.secondLottery}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="2025年12月17日（水）12:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">申込開始日時</label>
                  <input
                    type="text"
                    name="applicationStart"
                    value={applicationDetails.applicationStart}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="2025年12月10日（火）10:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">申込終了日時</label>
                  <input
                    type="text"
                    name="applicationEnd"
                    value={applicationDetails.applicationEnd}
                    onChange={handleApplicationDetailsChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="2025年12月14日（日）23:59"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  申込注意事項（1行に1項目）
                </label>
                <textarea
                  name="notes"
                  value={applicationDetails.notes}
                  onChange={handleApplicationDetailsChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  placeholder="注意事項を1行ずつ入力してください"
                />
              </div>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            下書き保存
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            公開
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
