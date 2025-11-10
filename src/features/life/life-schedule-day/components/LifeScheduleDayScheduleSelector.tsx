import React from 'react';
import { Schedule } from '../hooks/useLifeScheduleDayState';
import { toTimeString } from 'utils/dateUtil';

export interface LifeScheduleDayScheduleSelectorProps {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  onSelectSchedule: (scheduleId: string) => void;
}

/**
 * 予定セレクタコンポーネント
 * 予定をセレクトボックスで選択できるようにする
 */
export const LifeScheduleDayScheduleSelector: React.FC<LifeScheduleDayScheduleSelectorProps> = ({
  schedules,
  selectedSchedule,
  onSelectSchedule,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectSchedule(event.target.value);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
      <label htmlFor="schedule-selector" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        予定:
      </label>
      <select
        id="schedule-selector"
        className="flex-1 border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={selectedSchedule?.scheduleId || ''}
        onChange={handleChange}
      >
        {schedules.length === 0 ? (
          <option value="">予定なし</option>
        ) : (
          schedules.map((schedule) => (
            <option key={schedule.scheduleId} value={schedule.scheduleId}>
              ( {toTimeString(schedule.startDateTime)} - {toTimeString(schedule.endDateTime)} ) {schedule.scheduleName}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
