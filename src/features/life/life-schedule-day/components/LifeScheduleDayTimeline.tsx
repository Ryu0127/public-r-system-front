import TimelineScrollingHorizontal, { Task, TimeSlot } from 'components/molecules/timelines/TimelineScrollingHorizontal';
import React from 'react';

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
}) => {
  return (
    <div className="inline-block">
      {/* タイムライン */}
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