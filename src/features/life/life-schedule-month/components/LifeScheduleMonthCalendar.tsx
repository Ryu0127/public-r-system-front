import React from 'react';
import { MonthlyTasksMap } from '../hooks/useLifeScheduleMonthState';

interface LifeScheduleMonthCalendarProps {
  currentMonth: Date;
  monthlyTasks: MonthlyTasksMap;
  onDateClick: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string;
}

/**
 * 月のカレンダー日付配列を生成する
 */
const generateCalendarDays = (currentMonth: Date): CalendarDay[] => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 月の最初の日と最後の日
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 最初の日の曜日（0: 日曜, 1: 月曜, ...）
  const firstDayOfWeek = firstDay.getDay();

  // カレンダー表示のための配列
  const calendarDays: CalendarDay[] = [];

  // 前月の日付を埋める
  const prevMonthLastDay = new Date(year, month, 0);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  // 当月の日付
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  // 次月の日付を埋める（カレンダーを6週間分表示）
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  return calendarDays;
};

/**
 * 日付を yyyy-mm-dd 形式の文字列に変換
 */
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 今日かどうかを判定
 */
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * 月次カレンダーコンポーネント
 */
const LifeScheduleMonthCalendar: React.FC<LifeScheduleMonthCalendarProps> = ({
  currentMonth,
  monthlyTasks,
  onDateClick,
}) => {
  const calendarDays = generateCalendarDays(currentMonth);
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 bg-gray-100 border-b">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-2 text-center text-sm font-semibold ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7">
        {calendarDays.map((calendarDay, index) => {
          const tasks = monthlyTasks[calendarDay.dateKey] || [];
          const dayOfWeek = calendarDay.date.getDay();

          return (
            <div
              key={index}
              className={`min-h-[120px] border-b border-r p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                !calendarDay.isCurrentMonth ? 'bg-gray-50' : ''
              } ${calendarDay.isToday ? 'bg-blue-50' : ''}`}
              onClick={() => onDateClick(calendarDay.date)}
            >
              {/* 日付表示 */}
              <div
                className={`text-sm font-medium mb-1 ${
                  calendarDay.isToday
                    ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                    : dayOfWeek === 0
                    ? 'text-red-600'
                    : dayOfWeek === 6
                    ? 'text-blue-600'
                    : calendarDay.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {calendarDay.date.getDate()}
              </div>

              {/* タスクリスト（最大3件表示） */}
              <div className="space-y-1">
                {tasks.slice(0, 3).map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="text-xs px-2 py-1 rounded truncate"
                    style={{ backgroundColor: task.projectColor + '20', color: task.projectColor }}
                    title={task.taskName}
                  >
                    {task.taskName}
                  </div>
                ))}
                {tasks.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{tasks.length - 3} 件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifeScheduleMonthCalendar;
