import React from 'react';

export interface TimelineScrollingHorizontalProps {
    timeSlots: TimeSlot[];
    tasks: Task[];
    splitTime: number;
    gridColsClass: string;
    onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', event: React.MouseEvent) => void;
}

export interface TimeSlot {
    date: Date;
    isNowHour: boolean;
    isTimeView: boolean;
}

export interface Task {
    tmpId: number;
    taskId: string;
    taskName: string;
    startDateTime: Date;
    endDateTime: Date;
    projectId?: string;
    selectData: {
        masterTaskId: string;
    };
    projectColor: string;
    remarks: string | null;
}

const TimelineScrollingHorizontal: React.FC<TimelineScrollingHorizontalProps> = ({ timeSlots, tasks, splitTime, gridColsClass, onDragStart }) => {
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    };
    const isInTimeRange = (task: Task, timeSlot: Date): boolean => {
        return timeSlot >= task.startDateTime && timeSlot < task.endDateTime;
    };
    const isStartTime = (task: Task, timeSlot: Date): boolean => {
        return timeSlot.getTime() === task.startDateTime.getTime();
    };
    const isEndTime = (task: Task, timeSlot: Date): boolean => {
        return new Date(timeSlot.getTime() + splitTime * 60000).getTime() === task.endDateTime.getTime();
    };
    return (
        <>
            {/* 時間軸ヘッダー */}
            <div className={`grid border-b sticky top-0 h-[37px] bg-white z-10 ${gridColsClass}`}>
                {timeSlots.map((slot, index) => {
                    const isNowHourSlot = slot.isNowHour;
                    const isTimeView = slot.isTimeView;
                    return (
                        <div key={index} className={`p-1 text-start text-xs ${isNowHourSlot ? 'border-red-600 border-l-4' : 'border-l'} ${isTimeView ? 'font-medium' : 'text-gray-400'}`}>
                            {isTimeView ? formatTime(slot.date) : ''}
                        </div>
                    );
                })}
            </div>
            {/* タスクエリア */}
            <div className="pb-[86px]">
                {tasks.map((task) => (
                    <div key={task.taskId} className={`grid h-[110px] border-b ${gridColsClass}`}>
                        {timeSlots.map((slot, index) => {
                            const isInRange = isInTimeRange(task, slot.date);
                            const isStart = isStartTime(task, slot.date);
                            const isEnd = isEndTime(task, slot.date);
                            const isNowHourSlot = slot.isNowHour;
                            return (
                                <div key={index} className={`relative h-[110px] ${isNowHourSlot ? 'border-red-600 border-l-4' : 'border-l'}`}>
                                    {isInRange && (
                                        <>
                                            {/* タスクバー */}
                                            <div
                                              className={`absolute top-6 h-12 cursor-move`}
                                              style={{
                                                left: '0',
                                                width: `100%`,
                                                opacity: 0.7,
                                                backgroundColor: task.projectColor
                                              }}
                                              onMouseDown={(e) => onDragStart(task.tmpId, 'move', e)}
                                            />
                                            {/* 開始ハンドル */}
                                            {isStart && (
                                              <div
                                                className="absolute top-6 left-0 w-1 h-12 bg-black cursor-ew-resize hover:bg-blue-500 transition-colors"
                                                style={{ width: '4px', left: '-2px' }}
                                                onMouseDown={(e) => onDragStart(task.tmpId, 'start', e)}
                                              />
                                            )}
                                            {/* 終了ハンドル */}
                                            {isEnd && (
                                              <div
                                                className="absolute top-6 right-0 w-1 h-12 bg-black cursor-ew-resize hover:bg-blue-500 transition-colors"
                                                style={{ width: '4px', right: '-2px' }}
                                                onMouseDown={(e) => onDragStart(task.tmpId, 'end', e)}
                                              />
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};

export default TimelineScrollingHorizontal;