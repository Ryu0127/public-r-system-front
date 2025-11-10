import TimelineScrollingHorizontal, { Task, TimeSlot } from 'components/molecules/timelines/TimelineScrollingHorizontal';
import React from 'react';
import { Schedule } from '../hooks/useLifeScheduleDayState';

interface Props {
  config?: {
  }
  item?: {
    timeSlots: TimeSlot[];
    masterTasks: {
      taskId: string;
      taskName: string;
      taskColor: string;
    }[];
  }
  data?: {
    tasks: Task[];
  }
  controls?: {
    taskControls: {
      onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', event: React.MouseEvent | React.TouchEvent) => void;
      onTaskTap?: (tmpId: number) => void; // タスクタップ時のコールバック（モバイル用）
    };
  };
  selectedSchedule?: Schedule | null;
}

/**
 * タイムラインコンポーネント
 * スケジュール画面の右側に表示されるタイムラインを提供
 */
export const LifeScheduleDayTimeline: React.FC<Props> = ({
  config = {},
  item = { timeSlots: [], masterTasks: [] },
  data = { tasks: [] },
  controls = {
    taskControls: {
      onDragStart: () => {},
    },
  },
  selectedSchedule = null,
}) => {
  // 予定の開始時刻と終了時刻に基づいてグリッド位置を計算
  const calculateGridPosition = (startTime: Date, endTime: Date) => {
    const baseTime = new Date(startTime);
    baseTime.setHours(5, 0, 0, 0); // 5:00を基準とする

    const startMinutes = (startTime.getTime() - baseTime.getTime()) / (1000 * 60);
    const endMinutes = (endTime.getTime() - baseTime.getTime()) / (1000 * 60);

    const startCol = Math.floor(startMinutes / 15) + 1;
    const endCol = Math.floor(endMinutes / 15) + 1;

    return { startCol, endCol };
  };

  return (
    <div className="inline-block">
      {/* ヘッダー */}
      <div className="h-[37px] flex items-center border-b bg-white sticky top-0 z-10">
        <div className="grid grid-cols-[repeat(96,minmax(35px,1fr))] w-full">
          {item.timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`border-l h-[37px] flex items-center justify-center text-xs ${
                slot.isNowHour ? 'bg-red-100' : ''
              }`}
            >
              {slot.isTimeView && (
                <span className="text-gray-600">{slot.date.getHours()}:{slot.date.getMinutes().toString().padStart(2, '0')}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 予定行（表示のみ・編集不可） */}
      {selectedSchedule && (
        <div className="h-[110px] border-b bg-blue-50 relative">
          <div className="grid grid-cols-[repeat(96,minmax(35px,1fr))] h-full">
            {item.timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`border-l h-full ${slot.isNowHour ? 'bg-red-50' : ''}`}
              />
            ))}
          </div>
          {/* 予定バー */}
          {(() => {
            const { startCol, endCol } = calculateGridPosition(
              selectedSchedule.startDateTime,
              selectedSchedule.endDateTime
            );
            return (
              <div
                className="absolute top-2 h-[calc(100%-16px)] rounded shadow-sm border-2 border-blue-400 bg-blue-200 flex items-center px-2"
                style={{
                  gridColumnStart: startCol,
                  gridColumnEnd: endCol,
                  left: `${(startCol - 1) * 35}px`,
                  width: `${(endCol - startCol) * 35}px`,
                  pointerEvents: 'none', // ドラッグ不可
                }}
              >
                <div className="text-sm font-medium text-blue-900 truncate">
                  {selectedSchedule.scheduleName}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* タスクのタイムライン */}
      <TimelineScrollingHorizontal
        timeSlots={item.timeSlots}
        tasks={data?.tasks}
        splitTime={15}
        gridColsClass="grid-cols-[repeat(96,minmax(35px,1fr))]"
        onDragStart={controls.taskControls.onDragStart}
        onTaskTap={controls.taskControls.onTaskTap}
      />
    </div>
  );
};

export default LifeScheduleDayTimeline;