import React, { useRef, useEffect } from 'react';

export interface TimelineScrollingHorizontalProps {
    timeSlots: TimeSlot[];
    tasks: Task[];
    splitTime: number;
    gridColsClass: string;
    onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', event: React.MouseEvent | React.TouchEvent) => void;
    onTaskTap?: (tmpId: number) => void; // タスクタップ時のコールバック（モバイル用）
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

const TimelineScrollingHorizontal: React.FC<TimelineScrollingHorizontalProps> = ({ timeSlots, tasks, splitTime, gridColsClass, onDragStart, onTaskTap }) => {
    // タスクバーとハンドルのrefを保存
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const startHandleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const endHandleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    // リスナーを保存するMap
    const taskListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());
    const startHandleListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());
    const endHandleListeners = useRef<Map<string, (e: TouchEvent) => void>>(new Map());
    // ロングタップ検出用のタイマーとフラグ
    const longPressTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const isLongPress = useRef<Map<string, boolean>>(new Map());
    const touchStartPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

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
                                                // モバイル用：ロングタップ検出
                                                const touch = e.touches[0];
                                                const taskId = task.tmpId.toString();

                                                // タッチ位置を記録
                                                touchStartPositions.current.set(taskId, { x: touch.clientX, y: touch.clientY });
                                                // ロングタップフラグをリセット
                                                isLongPress.current.set(taskId, false);

                                                // ロングタップ検出タイマーを開始（100ms）
                                                const timer = setTimeout(() => {
                                                  isLongPress.current.set(taskId, true);
                                                  // ロングタップの場合はドラッグを開始
                                                  console.log('[ロングタップ検出]', { tmpId: task.tmpId, type: 'move', clientX: touch.clientX, timestamp: Date.now() });
                                                  onDragStart(task.tmpId, 'move', e);
                                                }, 100);

                                                longPressTimers.current.set(taskId, timer);
                                              }}
                                              onTouchEnd={(e) => {
                                                // タッチ終了時の処理
                                                const taskId = task.tmpId.toString();
                                                const timer = longPressTimers.current.get(taskId);

                                                // タイマーをクリア
                                                if (timer) {
                                                  clearTimeout(timer);
                                                  longPressTimers.current.delete(taskId);
                                                }

                                                // ロングタップでなかった場合（タップ）は詳細パネルを開く
                                                if (!isLongPress.current.get(taskId)) {
                                                  const startPos = touchStartPositions.current.get(taskId);
                                                  const endTouch = e.changedTouches[0];

                                                  // タッチ位置が大きく移動していない場合のみタップと判定
                                                  if (startPos && endTouch) {
                                                    const deltaX = Math.abs(endTouch.clientX - startPos.x);
                                                    const deltaY = Math.abs(endTouch.clientY - startPos.y);

                                                    // 10px以内の移動ならタップと判定
                                                    if (deltaX < 10 && deltaY < 10) {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      if (onTaskTap) {
                                                        onTaskTap(task.tmpId);
                                                      }
                                                    }
                                                  }
                                                }

                                                // クリーンアップ
                                                isLongPress.current.delete(taskId);
                                                touchStartPositions.current.delete(taskId);
                                              }}
                                              onTouchMove={(e) => {
                                                // タッチ移動時の処理
                                                const taskId = task.tmpId.toString();
                                                const startPos = touchStartPositions.current.get(taskId);
                                                const currentTouch = e.touches[0];

                                                // タッチ位置が大きく移動した場合はロングタップタイマーをキャンセル
                                                if (startPos && currentTouch) {
                                                  const deltaX = Math.abs(currentTouch.clientX - startPos.x);
                                                  const deltaY = Math.abs(currentTouch.clientY - startPos.y);

                                                  // 10px以上移動した場合はタイマーをキャンセル
                                                  if (deltaX > 10 || deltaY > 10) {
                                                    const timer = longPressTimers.current.get(taskId);
                                                    if (timer) {
                                                      clearTimeout(timer);
                                                      longPressTimers.current.delete(taskId);
                                                    }
                                                  }
                                                }
                                              }}
                                            >
                                              {/* スケジュール名（スマホ・タブレット表示のみ） */}
                                              {isStart && (
                                                <div className="md:hidden absolute left-1 top-0 h-full flex items-center pointer-events-none">
                                                  <span className="text-xs font-medium text-white truncate max-w-[200px]">
                                                    {task.taskName}
                                                  </span>
                                                </div>
                                              )}
                                            </div>
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