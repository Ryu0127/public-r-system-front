import React from 'react';
import { ScheduleItem } from '../data/mockDashboardData';

interface ScheduleWidgetProps {
  schedules: ScheduleItem[];
}

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ schedules }) => {
  // 日付ごとにグループ化
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = [];
    }
    acc[schedule.date].push(schedule);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // 日付をソート
  const sortedDates = Object.keys(groupedSchedules).sort();

  // 日付を表示用にフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return `本日 (${month}/${day})`;
    } else if (isTomorrow) {
      return `明日 (${month}/${day})`;
    } else {
      return `${month}/${day}`;
    }
  };

  // カテゴリーアイコンを取得
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work':
        return '💼';
      case 'personal':
        return '👤';
      case 'event':
        return '🎉';
      default:
        return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">予定</h2>

      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">予定がありません</p>
        ) : (
          sortedDates.slice(0, 3).map((date) => (
            <div key={date} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{formatDate(date)}</h3>
              <div className="space-y-2">
                {groupedSchedules[date].map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-xl">{getCategoryIcon(schedule.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">{schedule.time}</span>
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: schedule.color }}
                        ></span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">{schedule.title}</p>
                      {schedule.description && (
                        <p className="text-xs text-gray-500 truncate">{schedule.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {sortedDates.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            すべての予定を見る →
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleWidget;
