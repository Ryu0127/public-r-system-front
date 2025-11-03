import React, { useRef, useEffect } from 'react';

export interface TimelineScrollingHorizontalProps {
    timeSlots: TimeSlot[];
    tasks: Task[];
    splitTime: number;
    gridColsClass: string;
    onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', event: React.MouseEvent | React.TouchEvent) => void;
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
    // タスクバーとハンドルのrefを保存
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const startHandleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const endHandleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    // リスナーを保存するMap
    const taskListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());
    const startHandleListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());
    const endHandleListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());

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

    // タッチイベントリスナーの設定
    useEffect(() => {
        const taskElements = taskRefs.current;
        const startHandleElements = startHandleRefs.current;
        const endHandleElements = endHandleRefs.current;
        const taskListenerMap = taskListeners.current;
        const startHandleListenerMap = startHandleListeners.current;
        const endHandleListenerMap = endHandleListeners.current;

        const handleTouchStart = (e: TouchEvent, taskId: number, type: 'start' | 'end') => {
            // 開始/終了ハンドル用のハンドラー
            const touch = e.touches[0];
            console.log('[ドラッグ開始]', { tmpId: taskId, type, clientX: touch.clientX, eventType: 'touchstart', timestamp: Date.now() });
            
            // イベントの伝播を停止してタイムライン要素のリスナーに到達させない
            e.stopPropagation();
            e.preventDefault();
            
            // React.TouchEventのような構造を作成
            const syntheticEvent = {
                touches: [touch],
                targetTouches: [touch],
                changedTouches: [touch],
                nativeEvent: e,
                currentTarget: e.currentTarget,
                target: e.target,
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                defaultPrevented: e.defaultPrevented,
                eventPhase: e.eventPhase,
                isTrusted: e.isTrusted,
                preventDefault: () => {
                    e.preventDefault();
                },
                stopPropagation: () => {
                    e.stopPropagation();
                },
                timeStamp: e.timeStamp,
                type: 'touchstart',
            } as unknown as React.TouchEvent;
            // タッチ開始時に即座にonDragStartを呼び出す
            onDragStart(taskId, type, syntheticEvent);
        };

        // タスクバーはReactのonTouchStartを使用するため、ネイティブリスナーは不要
        // ただし、既存のリスナーがある場合はクリーンアップ
        taskElements.forEach((element, taskId) => {
            const existingListener = taskListenerMap.get(taskId);
            if (existingListener) {
                element.removeEventListener('touchstart', existingListener, { capture: true });
                taskListenerMap.delete(taskId);
            }
        });

        // 開始ハンドルのリスナーを追加（キャプチャフェーズで登録してタイムライン要素のリスナーより先に処理）
        startHandleElements.forEach((element, taskId) => {
            // 既存のリスナーを削除
            const existingListener = startHandleListenerMap.get(taskId);
            if (existingListener) {
                element.removeEventListener('touchstart', existingListener, { capture: true });
            }
            // 新しいリスナーを追加（キャプチャフェーズ）
            const listener = (e: TouchEvent) => handleTouchStart(e, parseInt(taskId), 'start');
            element.addEventListener('touchstart', listener, { passive: false, capture: true });
            startHandleListenerMap.set(taskId, listener);
        });

        // 終了ハンドルのリスナーを追加（キャプチャフェーズで登録してタイムライン要素のリスナーより先に処理）
        endHandleElements.forEach((element, taskId) => {
            // 既存のリスナーを削除
            const existingListener = endHandleListenerMap.get(taskId);
            if (existingListener) {
                element.removeEventListener('touchstart', existingListener, { capture: true });
            }
            // 新しいリスナーを追加（キャプチャフェーズ）
            const listener = (e: TouchEvent) => handleTouchStart(e, parseInt(taskId), 'end');
            element.addEventListener('touchstart', listener, { passive: false, capture: true });
            endHandleListenerMap.set(taskId, listener);
        });

        return () => {
            // クリーンアップ: すべてのリスナーを削除
            taskElements.forEach((element, taskId) => {
                const listener = taskListenerMap.get(taskId);
                if (listener) {
                    element.removeEventListener('touchstart', listener, { capture: true });
                    taskListenerMap.delete(taskId);
                }
            });
            startHandleElements.forEach((element, taskId) => {
                const listener = startHandleListenerMap.get(taskId);
                if (listener) {
                    element.removeEventListener('touchstart', listener, { capture: true });
                    startHandleListenerMap.delete(taskId);
                }
            });
            endHandleElements.forEach((element, taskId) => {
                const listener = endHandleListenerMap.get(taskId);
                if (listener) {
                    element.removeEventListener('touchstart', listener, { capture: true });
                    endHandleListenerMap.delete(taskId);
                }
            });
        };
    }, [tasks, onDragStart]);
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
                                              ref={(el) => {
                                                if (el) {
                                                  taskRefs.current.set(task.tmpId.toString(), el);
                                                } else {
                                                  taskRefs.current.delete(task.tmpId.toString());
                                                }
                                              }}
                                              className={`absolute top-6 h-12 cursor-move touch-none`}
                                              style={{
                                                left: '0',
                                                width: `100%`,
                                                opacity: 0.7,
                                                backgroundColor: task.projectColor
                                              }}
                                              onMouseDown={(e) => onDragStart(task.tmpId, 'move', e)}
                                              onTouchStart={(e) => {
                                                // タッチ開始時に即座にログを出力
                                                const touch = e.touches[0];
                                                console.log('[ドラッグ開始]', { tmpId: task.tmpId, type: 'move', clientX: touch.clientX, eventType: 'touchstart', timestamp: Date.now() });
                                                // タッチイベントでドラッグを開始
                                                onDragStart(task.tmpId, 'move', e);
                                              }}
                                            />
                                            {/* 開始ハンドル */}
                                            {isStart && (
                                              <div
                                                ref={(el) => {
                                                  if (el) {
                                                    startHandleRefs.current.set(task.tmpId.toString(), el);
                                                  } else {
                                                    startHandleRefs.current.delete(task.tmpId.toString());
                                                  }
                                                }}
                                                className="absolute top-6 left-0 w-1 h-12 bg-black cursor-ew-resize hover:bg-blue-500 transition-colors touch-none"
                                                style={{ width: '4px', left: '-2px' }}
                                                onMouseDown={(e) => onDragStart(task.tmpId, 'start', e)}
                                              />
                                            )}
                                            {/* 終了ハンドル */}
                                            {isEnd && (
                                              <div
                                                ref={(el) => {
                                                  if (el) {
                                                    endHandleRefs.current.set(task.tmpId.toString(), el);
                                                  } else {
                                                    endHandleRefs.current.delete(task.tmpId.toString());
                                                  }
                                                }}
                                                className="absolute top-6 right-0 w-1 h-12 bg-black cursor-ew-resize hover:bg-blue-500 transition-colors touch-none"
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